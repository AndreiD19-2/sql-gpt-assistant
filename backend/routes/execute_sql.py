# routes/execute_router.py

from fastapi import APIRouter
from pydantic import BaseModel
from services.sql_executor import execute_sql_query, is_query_safe

router = APIRouter()

class SQLInput(BaseModel):
    sql: str
    force: bool = False  # dacă user confirmă explicit executarea

@router.post("/execute-sql")
def execute_sql(sql_input: SQLInput):
    if not sql_input.force:
        if not is_query_safe(sql_input.sql):
            return {
                "status": "warning",
                "message": "Query-ul este periculos. Trebuie confirmare explicită (force=true) pentru execuție.",
                "query": sql_input.sql
            }

    result = execute_sql_query(sql_input.sql)
    return result
