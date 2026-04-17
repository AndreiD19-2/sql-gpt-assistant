from services.schema_service import build_schema_text

def generate_prompt_with_schema(mode: str, user_input: str) -> str:
    schema = build_schema_text()

    if mode == "insert":
        return f"""
You are a SQL Server assistant. Based on the schema below, generate SQL INSERT statements.

- DO NOT include IDENTITY columns.
- Return only raw SQL, no explanations.

{schema}

User request: {user_input}
"""

    elif mode == "select":
        return f"""
You are a SQL Server assistant. Based on the schema below, generate SQL SELECT queries.

- Use JOINs only if necessary.
- Return raw SQL only — no explanations or analysis.
- Add WHERE clauses only when specified.

{schema}

User request: {user_input}
"""

    elif mode == "update":
        return f"""
You are a SQL Server assistant. Based on the schema below, generate SQL UPDATE statements.

- Do NOT include IDENTITY columns in SET.
- Always include a WHERE clause to avoid mass updates.
- Return raw SQL only — no explanations.

{schema}

User request: {user_input}
"""

    elif mode == "delete":
        return f"""
You are a SQL Server assistant. Based on the schema below, generate SQL DELETE statements.

- Always include a WHERE clause to prevent deleting all rows.
- Return only raw SQL, no explanations.

{schema}

User request: {user_input}
"""

    elif mode == "procedure":
        return f"""
You are a SQL Server expert. Generate a CREATE PROCEDURE statement based on the following request.

- Use valid T-SQL syntax with BEGIN/END blocks.
- Use parameter names with proper data types.
- Do not explain. Return only SQL code.
- Use logic consistent with schema.

{schema}

User request: {user_input}
"""

    elif mode == "trigger":
        return f"""
You are a SQL Server expert. Generate a CREATE TRIGGER statement for the request below.

- Trigger should be defined as AFTER or INSTEAD OF depending on context.
- Include proper referencing of inserted/deleted tables.
- Do not return explanations.

{schema}

User request: {user_input}
"""

    elif mode == "ddl":
        return f"""
You are a SQL Server assistant. Based on the user instruction, generate a CREATE TABLE or ALTER TABLE statement.

- Use proper data types and constraints.
- Do not include explanations, return only SQL.

{schema}

User request: {user_input}
"""

    elif mode == "dictionary":
        return f"""
You are a SQL language tutor. Based on the instruction below, explain the SQL concept or syntax clearly.

- Include examples when appropriate.
- Do not generate SQL code unless asked.

Instruction: {user_input}
"""

    elif mode == "transaction":
        return f"""
You are a SQL Server assistant. Generate transactional SQL commands for the request below.

- Use BEGIN TRANSACTION, COMMIT, and ROLLBACK properly.
- Include SAVEPOINT if needed.

{schema}

User request: {user_input}
"""

    elif mode == "analyze":
        return f"""
You are a SQL Server assistant. Your task is to help analyze a query execution plan.

- Generate an EXPLAIN plan for the query.
- Use SET SHOWPLAN_ALL ON or EXPLAIN equivalent.
- Do not execute the query.
- Return the query and the analysis only.

Query to analyze:
{user_input}
"""

    elif mode == "view":
        return f"""
You are a SQL Server assistant. Based on the request below, generate a CREATE VIEW statement.

- Use SELECT logic based on the schema.
- Name the view appropriately.
- Return only SQL code.

{schema}

User request: {user_input}
"""

    elif mode == "index":
        return f"""
You are a database index advisor. Based on the request below and the schema provided, suggest the best CREATE INDEX statement(s).

- Use meaningful index names.
- Target SELECT or JOIN performance improvements.
- Explain your rationale after the SQL.

{schema}

Request: {user_input}
"""

    elif mode == "join":
        return f"""
You are a JOIN assistant for SQL Server. Based on the user's request and schema, generate the appropriate SELECT query with JOINs.

- Choose INNER JOIN, LEFT JOIN, etc. based on logic.
- Use FK/PK relationships where possible.

{schema}

User request: {user_input}
"""

    elif mode == "validate":
        return f"""
You are a SQL data validator. Generate SELECT statements that help identify problems like:

- NULLs where not expected
- Missing values
- Duplicate keys

{schema}

Validation requested: {user_input}
"""

    elif mode == "import":
        return f"""
Generate a BULK INSERT statement or data import command for SQL Server based on the request below.

- Specify file path and columns clearly.
- Return only the SQL or command.

Instruction: {user_input}
"""

    elif mode == "clean":
        return f"""
You are a SQL data cleaning assistant. Generate UPDATE queries to clean or normalize data:

- Use functions like TRIM, LOWER, REPLACE, CAST, etc.
- Return only SQL code.

{schema}

Request: {user_input}
"""

    elif mode == "job":
        return f"""
Generate a SQL Server Agent job using T-SQL to schedule a task like a backup or report.

- Use sp_add_job, sp_add_schedule, and sp_add_jobstep
- Return the full script.

Request: {user_input}
"""

    elif mode == "aggregate":
        return f"""
Generate a SELECT statement with aggregation.

- Use SUM, AVG, COUNT, MAX, MIN
- Include GROUP BY and HAVING if needed.

{schema}

User request: {user_input}
"""

    elif mode == "security":
        return f"""
Generate SQL commands to manage permissions (GRANT, REVOKE, CREATE ROLE, etc.) for SQL Server.

Instruction: {user_input}
"""

    else:
        raise ValueError(f"Unsupported mode: {mode}")
