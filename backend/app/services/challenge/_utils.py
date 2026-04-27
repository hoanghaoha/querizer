import sqlite3
import anthropic

from app.config import settings
from app.services.challenge.prompt import (
    REVIEW_PROMPT,
    SOLUTION_PROMPT,
    TOPIC_PROMPT,
    build_generate_solution_prompt,
    build_generate_topic_prompt,
    build_review_prompt,
)
from app.services._utils import message_text, parse_llm_json


client = anthropic.AsyncAnthropic(api_key=settings.anthropic_key)


class ChallengeGenerator:
    def __init__(
        self,
        industry: str,
        db_schema: dict,
        topics: str,
        level: str,
        context: str,
        max_retries: int,
    ) -> None:
        self.industry = industry
        self.db_schema = db_schema
        self.topics = topics
        self.level = level
        self.context = context
        self.max_retries = max_retries

    async def generate(self) -> dict:
        await self.generate_topic()
        solution = await self.generate_solution()
        return await self.review_solution(solution)

    async def generate_topic(self):
        message = await client.messages.create(
            model="claude-haiku-4-5",
            max_tokens=2048,
            system=TOPIC_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": build_generate_topic_prompt(
                        self.industry,
                        self.db_schema,
                        self.topics,
                        self.level,
                        self.context,
                    ),
                }
            ],
        )
        data = parse_llm_json(message_text(message))
        self.name = data["name"]
        self.description = data["description"]
        self.generated_topics: list[str] = data.get("topics", [])

    async def generate_solution(self) -> str:
        message = await client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2048,
            system=SOLUTION_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": build_generate_solution_prompt(
                        self.db_schema, self.name, self.description
                    ),
                }
            ],
        )
        data = parse_llm_json(message_text(message))
        return data["solution"]

    async def review_solution(self, solution: str) -> dict:
        error = self._validate_on_sqlite(self.db_schema, solution)

        if error is None:
            return {"solution": solution}

        for _ in range(self.max_retries):
            message = await client.messages.create(
                model="claude-opus-4-7",
                max_tokens=8192,
                system=REVIEW_PROMPT,
                messages=[
                    {
                        "role": "user",
                        "content": build_review_prompt(
                            self.db_schema, self.name, self.description, solution, error
                        ),
                    }
                ],
            )
            data = parse_llm_json(message_text(message))
            solution = data["solution"]
            error = self._validate_on_sqlite(self.db_schema, solution)
            if error is None:
                return {"solution": solution}

        raise RuntimeError(f"Failed to generate a valid SQLite solution: {error}")

    def _apply_schema(self, conn: sqlite3.Connection, db_schema: dict) -> None:
        cur = conn.cursor()
        for table in db_schema["tables"]:
            col_defs = []
            for col in table["columns"]:
                col_def = f"{col['name']} {col['type']}"
                if col.get("primary_key"):
                    col_def += " PRIMARY KEY AUTOINCREMENT"
                if not col.get("nullable", True) and not col.get("primary_key"):
                    col_def += " NOT NULL"
                if col.get("unique"):
                    col_def += " UNIQUE"
                col_defs.append(col_def)
            cur.execute(
                f"CREATE TABLE IF NOT EXISTS {table['name']} ({', '.join(col_defs)})"
            )

    def _validate_on_sqlite(self, db_schema: dict, solution: str) -> str | None:
        """Run the query on an in-memory SQLite DB built from the schema.
        Returns None on success, or the SQLite error message on failure.
        """
        conn = sqlite3.connect(":memory:")
        try:
            self._apply_schema(conn, db_schema)
            cur = conn.cursor()
            cur.execute(solution)
            cur.fetchall()
            return None
        except Exception as e:
            return str(e)
        finally:
            conn.close()
