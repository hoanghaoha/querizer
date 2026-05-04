from typing import Any
import uuid
import random
import sqlite3
import time

import anthropic
import numpy as np
from faker import Faker

from app.config import settings
from app.schemas.database import DatabaseGenerateRequest
from .prompt import SYSTEM_PROMPT, build_user_prompt
from .._utils import message_text, parse_llm_json


client = anthropic.AsyncAnthropic(api_key=settings.anthropic_key)
fake = Faker()


class DatabaseGenerator:
    """
    Generate a SQLite database with synthetic data from an AI-produced schema.

    Pipeline:
                         generate()
                             |
                       _sort_tables()         <- topological sort by FK deps
                             |
                      _create_tables()        <- DDL: CREATE TABLE per table
                             |
                 .-----------+-----------.
                 |   for each table      |
                 |                       |
                 |  _generate_rows()     |
                 |    _value_for() ------+---> faker
                 |         |            |     enum
                 |  _insert_rows()      |     numpy
                 |         |            |     foreign_key
                 |   _cache_pks()       |     random_int / float
                 |                      |
                 '----------------------'
                             |
                      GenerateResult

    Usage:
        generator = DatabaseGenerator(request)
        result = await generator.generate()
    """

    def __init__(self, request: DatabaseGenerateRequest):
        self.name = request.name
        self.industry = request.industry
        self.size = request.size
        self.description = request.description or ""

        self.database_id = str(uuid.uuid4())
        self.row_count: int = 0
        self.pk_cache: dict[str, list] = {}

        self.db_path = f"{settings.databases_path}/{self.database_id}"
        self.conn: sqlite3.Connection | None = None

    @property
    def _conn(self) -> sqlite3.Connection:
        """Return the active connection, or raise if not connected."""
        if self.conn is None:
            raise RuntimeError("No active database connection.")
        return self.conn

    def _pk_col(self, table: dict) -> dict | None:
        """Return the primary key column definition, or None if absent."""
        return next((c for c in table["columns"] if c.get("primary_key")), None)

    def _non_pk_cols(self, table: dict) -> list[dict]:
        """Return all non-primary-key column definitions for a table."""
        return [c for c in table["columns"] if not c.get("primary_key")]

    async def generate(self) -> None:
        """
        Generate the database end-to-end.

        1. Call the AI API to produce a schema.
        2. Topologically sort tables by foreign key dependencies.
        3. Create tables and insert synthetic data.
        """
        self.conn = sqlite3.connect(self.db_path)

        t0 = time.perf_counter()
        schema = await self.get_schema()
        print(f"[timer] schema generation: {time.perf_counter() - t0:.2f}s")

        try:
            t1 = time.perf_counter()
            self._create_tables(schema)
            self._insert_tables_data(schema)
            print(f"[timer] data generation: {time.perf_counter() - t1:.2f}s")
            self.conn.commit()
            self.schema = schema

        except Exception:
            self.conn.rollback()
            raise
        finally:
            self.conn.close()
            self.conn = None

    async def get_schema(self) -> dict:
        """
        Fetch a schema from the AI API and return it with tables sorted
        in dependency order (parent tables before child tables).
        """
        raw_schema = await self._generate_schema()
        return self._sort_tables(raw_schema)

    async def _generate_schema(self) -> dict:
        """Call the Anthropic API to generate a schema for the given industry and description."""
        message = await client.messages.create(
            model="claude-haiku-4-5",
            max_tokens=8192,
            system=[
                {
                    "type": "text",
                    "text": SYSTEM_PROMPT,
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            messages=[
                {
                    "role": "user",
                    "content": build_user_prompt(
                        self.industry, self.description, self.size
                    ),
                }
            ],
        )

        return parse_llm_json(message_text(message))

    def _sort_tables(self, schema: dict) -> dict:
        """
        Topologically sort tables so that referenced (parent) tables come
        before tables that reference them (child tables).

        Uses iterative DFS. Raises if a circular dependency is detected
        implicitly through infinite recursion (Python stack limit).
        """
        tables = {t["name"]: t for t in schema["tables"]}

        deps: dict[str, set[str]] = {name: set() for name in tables}
        for table in tables.values():
            for col in table["columns"]:
                ref = col.get("generator", {}).get("references", "")
                ref_table = ref.split(".")[0] if ref else None
                if ref_table and ref_table in tables:
                    deps[table["name"]].add(ref_table)

        ordered: list[dict] = []
        visited: set[str] = set()

        def visit(name: str) -> None:
            if name in visited:
                return
            visited.add(name)
            for dep in deps[name]:
                visit(dep)
            ordered.append(tables[name])

        for name in tables:
            visit(name)

        return {"tables": ordered}

    def _create_tables(self, schema: dict) -> None:
        """Create all tables in the database from the schema definition."""
        cur = self._conn.cursor()
        for table in schema["tables"]:
            col_defs = [self._col_def(c) for c in table["columns"]]
            cur.execute(
                f"CREATE TABLE IF NOT EXISTS {table['name']} ({', '.join(col_defs)})"
            )

    def _col_def(self, col: dict) -> str:
        """Build a column DDL fragment (e.g. 'email TEXT NOT NULL UNIQUE')."""
        parts = [col["name"], col["type"]]
        if col.get("primary_key"):
            parts.append("PRIMARY KEY AUTOINCREMENT")
        if not col.get("nullable", True) and not col.get("primary_key"):
            parts.append("NOT NULL")
        if col.get("unique"):
            parts.append("UNIQUE")
        return " ".join(parts)

    def _insert_tables_data(self, schema: dict) -> None:
        """Insert synthetic rows into every table and accumulate the row count."""
        for table in schema["tables"]:
            rows = self._generate_rows(table)
            self.row_count += self._insert_rows(table, rows)
            self._cache_pks(table)

    def _generate_rows(self, table: dict) -> list[tuple]:
        """Generate synthetic row tuples for a table (excluding PK columns)."""
        cols = self._non_pk_cols(table)
        row_count = table.get("row_count", 100)
        return [tuple(self._value_for(col) for col in cols) for _ in range(row_count)]

    def _insert_rows(self, table: dict, rows: list[tuple]) -> int:
        """
        Bulk-insert rows into a table.

        Returns:
            Number of rows inserted.
        """
        cols = self._non_pk_cols(table)
        col_names = ", ".join(c["name"] for c in cols)
        placeholders = ", ".join("?" for _ in cols)
        sql = f"INSERT OR IGNORE INTO {table['name']} ({col_names}) VALUES ({placeholders})"
        self._conn.executemany(sql, rows)
        return len(rows)

    def _cache_pks(self, table: dict) -> None:
        """
        Store all primary key values for a table in pk_cache so they can
        be referenced when generating foreign key values for child tables.
        """
        pk = self._pk_col(table)
        if not pk:
            return
        cur = self._conn.cursor()
        cur.execute(f"SELECT {pk['name']} FROM {table['name']}")
        self.pk_cache[f"{table['name']}.{pk['name']}"] = [r[0] for r in cur.fetchall()]

    def _value_for(self, col: dict) -> Any:
        """
        Generate a single value for a column.

        Respects null_rate: if set, randomly returns None at that probability.
        Dispatches to the appropriate generator based on col["generator"]["method"].
        """
        if col.get("null_rate", 0) > 0 and random.random() < col["null_rate"]:
            return None

        gen = col.get("generator", {})
        method = gen.get("method")

        dispatch = {
            "faker": lambda: self._faker(gen),
            "enum": lambda: self._enum(gen),
            "numpy": lambda: self._numpy(gen),
            "foreign_key": lambda: self._foreign_key(gen),
            "random_int": lambda: random.randint(
                gen.get("min", 1), gen.get("max", 100)
            ),
            "random_float": lambda: round(
                random.uniform(gen.get("min", 1.0), gen.get("max", 100.0)), 2
            ),
        }

        handler = dispatch.get(method)
        return handler() if handler else None

    def _faker(self, gen: dict) -> Any:
        """Generate a value using a Faker method specified in gen['faker_key']."""
        faker_method = getattr(fake, gen["faker_key"], None)
        if faker_method is None:
            raise ValueError(f"Unknown faker method: {gen['faker_key']}")
        args = gen.get("faker_args", {})
        return str(faker_method(**args) if args else faker_method())

    def _enum(self, gen: dict) -> str:
        """Pick a random value from a fixed list, with optional weights."""
        values = gen["values"]
        weights = gen.get("weights")
        return random.choices(values, weights=weights, k=1)[0]

    def _numpy(self, gen: dict) -> float:
        """
        Generate a numeric value from a statistical distribution.

        Supported distributions: lognormal, normal, uniform, exponential.
        """
        dist = gen["distribution"]

        if dist == "lognormal":
            val = np.random.lognormal(mean=gen["mean"], sigma=gen["sigma"])
        elif dist == "normal":
            val = np.random.normal(loc=gen["mean"], scale=gen["std"])
            val = max(val, gen["min"]) if "min" in gen else val
            val = min(val, gen["max"]) if "max" in gen else val
        elif dist == "uniform":
            val = np.random.uniform(low=gen["min"], high=gen["max"])
        elif dist == "exponential":
            val = np.random.exponential(scale=gen["scale"])
        else:
            raise ValueError(f"Unknown distribution: {dist}")

        return round(float(val), gen.get("round", 2))

    def _foreign_key(self, gen: dict) -> int:
        """
        Pick a valid foreign key value from the parent table's cached primary keys.

        Supports two distributions:
        - uniform (default): every parent ID has equal probability.
        - power_law: small IDs are picked far more often (Zipf distribution),
          simulating real-world skew (e.g. popular users get more orders).

        Raises:
            ValueError: If the referenced table has not been inserted yet.
        """
        ref_key = gen["references"]
        cached = self.pk_cache.get(ref_key)

        if not cached:
            raise ValueError(
                f"Foreign key '{ref_key}' not in cache — "
                f"ensure '{ref_key.split('.')[0]}' is inserted before this table."
            )

        if gen.get("distribution") == "power_law":
            idx = int(np.random.zipf(a=1.5)) % len(cached)
            return cached[idx]

        return random.choice(cached)
