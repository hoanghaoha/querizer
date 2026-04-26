import json

TOPIC_PROMPT = """
You write a SQL practice challenge for automated grading.

## Output: ONE JSON object, no prose around it.
Escape Markdown newlines as \\n and double quotes as \\" inside the `description` string.

Shape: {"name": "3-8 words", "description": "Markdown, see below", "topics": ["topic1", "topic2", "topic3"]}
topics: 1–3 items max — only the primary SQL concepts the challenge challenges. Do not list every clause used.

## Description format
Markdown, `###` headers, in this order. Omit conditional sections that don't apply.
- ### Context — 1-2 sentences framing the business problem.
- ### Task — what the student must compute.
- ### Output columns — EXACT columns in EXACT order with EXACT names, in backticks. For computed columns specify alias (e.g., `total_revenue` aliased from `SUM(amount)`).
- ### Filters (conditional) — every WHERE condition with exact values.
- ### Grouping (conditional) — aggregation functions and grouping keys.
- ### Ordering (REQUIRED) — sort columns + direction. Result must be deterministic.
- ### Limit (conditional) — e.g., "Top 5 rows."
- ### Tie-breaking (conditional) — secondary sort key if primary may tie.

## Difficulty rubric — match the requested level exactly
- **Beginner**: 1 table. SELECT/WHERE/ORDER BY/LIMIT and basic aggregates. No JOIN/GROUP BY/subquery/CTE/window. 3-6 lines.
- **Easy**: 1-2 tables. Single JOIN, simple GROUP BY with 1 aggregate, HAVING with 1 condition. At most 1 subquery. No CTE/window/self-join. 6-12 lines.
- **Medium**: 2-4 tables. Multiple JOINs, GROUP BY with multiple keys, CASE WHEN, strftime. May use ONE of: CTE, simple window (ROW_NUMBER/RANK), or self-join. 10-20 lines.
- **Hard**: 3+ tables, multi-step. Multiple CTEs, advanced windows (PARTITION BY, LAG/LEAD, running totals), recursive CTE if useful, complex CASE. 20-40 lines.
- **Hell**: composes multiple advanced techniques. Nested/recursive CTEs, multi-frame windows, gap-and-island, sessionization, percentiles, CASE pivots, hierarchies. Hard for an experienced SQL dev. 40+ lines, 3+ CTEs.

## Rules
- Use exact table/column names from the schema.
- Precise enough that any correct solution produces identical rows in identical order.
- Focus only on the requested topics.
- No "approximately"/"around"/"some" — use specific values.
- Do NOT include the SQL solution.

## Example
{"name":"Top 5 Customers by Revenue","description":"### Context\\nThe sales team wants to identify high-value customers.\\n\\n### Task\\nFind the top 5 customers by total revenue.\\n\\n### Output columns\\n- `customer_name` from `customers`\\n- `total_revenue` aliased from `SUM(order_items.price * order_items.quantity)`\\n\\n### Grouping\\nGroup by `customers.id`.\\n\\n### Ordering\\n`total_revenue` DESC.\\n\\n### Limit\\nTop 5 rows.\\n\\n### Tie-breaking\\n`customer_name` ASC if revenue ties.","topics":["JOIN","GROUP BY","ORDER BY"]}
"""


_OUTPUT_RULES = """## Output: ONE JSON object, no prose around it.
Escape SQL newlines as \\n and double quotes as \\" inside the `solution` string."""

_DQL_RULES = """## DQL only
- Must start with SELECT or WITH (after optional whitespace/comments).
- FORBIDDEN: INSERT, UPDATE, DELETE, REPLACE, MERGE, DROP, CREATE, ALTER, TRUNCATE, ATTACH, DETACH, PRAGMA, VACUUM, REINDEX, ANALYZE, BEGIN, COMMIT, ROLLBACK, SAVEPOINT, RELEASE.
- Exactly ONE statement, optional trailing `;`."""

_SQLITE_GOTCHAS = """## SQLite gotchas
- No FULL OUTER / RIGHT JOIN — use LEFT JOIN with swapped order.
- No PIVOT/CROSSTAB — use CASE.
- String concat is `||` not `+`.
- Date ops use strftime()."""


SOLUTION_PROMPT = f"""
You write the optimal SQLite query for a SQL challenge.

{_OUTPUT_RULES}

Shape: {{"solution": "<SQL as a single JSON string>"}}
Example: {{"solution":"SELECT customer_name, SUM(amount) AS total_revenue\\nFROM orders\\nGROUP BY customer_name\\nORDER BY total_revenue DESC\\nLIMIT 5;"}}

{_DQL_RULES}

## Correctness (non-negotiable)
- Runs on real SQLite without error.
- Uses only schema tables/columns.
- Matches the description exactly: columns, aliases, filters, grouping, ordering, limit.
- Fully deterministic — include the ORDER BY and tie-breaking keys from the description.

## Quality
- Prefer JOINs over correlated subqueries.
- Use CTEs instead of deeply nested subqueries.
- Use window functions when they express intent more clearly.
- Name columns explicitly — no SELECT *.
- No redundant DISTINCT (when GROUP BY de-duplicates) or HAVING (when WHERE works).
- Handle NULLs with COALESCE/NULLIF when needed.

{_SQLITE_GOTCHAS}
"""


REVIEW_PROMPT = f"""
You fix and improve a SQLite query that failed.

{_OUTPUT_RULES}

Shape: {{"solution": "<corrected SQL as a single JSON string>"}}

{_DQL_RULES}

## Fix (non-negotiable)
- Resolve the SQLite error.
- Preserve the original challenge intent: same columns, aliases, filters, grouping, ordering, limit.
- Uses only schema tables/columns.
- Fully deterministic.

## Improve while fixing
- Replace correlated subqueries with JOINs when possible.
- Refactor nested subqueries into CTEs when clearer.
- Use window functions if they express intent better.
- Remove redundant DISTINCT/HAVING/subquery wrappers.
- Handle NULLs with COALESCE/NULLIF.

{_SQLITE_GOTCHAS}
"""

HINT_PROMPT = """
You are a SQL tutor helping a student solve a SQL challenge.
Return the student's SQL with inline hints inserted as comments at the relevant positions.

Important context about correctness:
- The reference solution is ONE valid approach — many other approaches can be correct
- You will be told whether the student's query already produces the same result as the reference solution
- If the student's query is already correct, do NOT push them toward the reference style — instead provide hints about improvements: optimization, readability, alternative SQL features (CTEs, window functions, etc.), edge cases worth considering, or what concept this query demonstrates well
- If the student's query has a runtime error, you will be told the error — hint at the cause
- If the student's query runs but produces wrong results, hint at the specific logical gap (missing JOIN, wrong aggregation, bad filter, etc.) — not just stylistic differences from the reference

Rules for the DQL content:
- Do NOT reveal the full solution or write the correct query verbatim
- Preserve all the student's existing code exactly as written — do not rewrite or reorder it
- ALWAYS add at least one hint — never return SQL with zero `-- hint:` comments
- Insert hints as SQL line comments using the `-- hint: ...` prefix
- Place each hint immediately above the line or clause it relates to
- Use as many hints as needed to guide or teach the student — no fixed limit
- Each hint must be a single line of plain text — no markdown, backticks, bold, or bullets
- Reference specific table/column names from the schema when helpful
- If the student's DQL is empty or trivial, return a minimal skeleton (SELECT / FROM / ...) with `-- hint:` comments guiding the next step

OUTPUT FORMAT — STRICT:
- Your entire response MUST be a single JSON object and nothing else
- Do NOT write any prose, explanation, preamble, or postscript
- Do NOT wrap the JSON in markdown code fences (``` ... ```)
- Schema: {"dql": "<the DQL with hint comments as a JSON-escaped string>"}
- Inside the `dql` string: use \\n for newlines, escape any " with \\", no backticks, no markdown
- The first character of your response must be `{` and the last must be `}`

Example response:
{"dql": "-- hint: start by selecting from the orders table\\nSELECT *\\nFROM orders"}
"""


def build_generate_topic_prompt(
    industry: str,
    schema: dict,
    topics: str,
    level: str,
    context: str | None,
) -> str:
    schema_text = json.dumps(schema, indent=2)
    extra = f"\n\n## Additional Instructions\n{context}" if context else ""
    return f"""## Challenge Parameters
- Industry: {industry}
- Difficulty level: {level}
- SQL topics to cover: {topics}

## Database Schema
```json
{schema_text}
```{extra}
"""


def build_generate_solution_prompt(
    schema: dict,
    name: str,
    description: str,
) -> str:
    schema_text = json.dumps(schema, indent=2)
    return f"""## Challenge
**Name:** {name}

**Description:**
{description}

## Database Schema
```json
{schema_text}
```
"""


def build_review_prompt(
    schema: dict,
    name: str,
    description: str,
    bad_sql: str,
    error: str,
) -> str:
    schema_text = json.dumps(schema, indent=2)
    return f"""## Challenge
**Name:** {name}

**Description:**
{description}

## Database Schema
```json
{schema_text}
```

## Failed Solution
```sql
{bad_sql}
```

## SQLite Error
```
{error}
```
"""


def build_hint_prompt(
    sql: str,
    db_schema: dict,
    name: str,
    description: str,
    solution: str,
    is_valid: bool = False,
    student_error: str | None = None,
) -> str:
    if not sql.strip():
        status = "Status: student has not written any SQL yet — provide a starting skeleton with hints."
    elif student_error:
        status = f"Status: student's query failed with this error:\n{student_error}"
    elif is_valid:
        status = "Status: student's query already produces the correct result. Acknowledge this and only suggest improvements if meaningful."
    else:
        status = "Status: student's query runs but produces a different result than the reference solution."

    return f"""Challenge: {name}
Description: {description}

Schema:
{db_schema}

Reference solution (one valid approach — do not reveal):
{solution}

Student's current query:
{sql if sql.strip() else "(empty)"}

{status}
"""
