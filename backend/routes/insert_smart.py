# routes/insert_smart.py

from fastapi import APIRouter
from models import QueryRequest
from services.gpt_service import ask_gpt
from prompts.prompt_generator import generate_prompt_with_schema
from config import SQLSERVER_CONN_STR
import pyodbc

router = APIRouter()

@router.post("/insert-smart")
def insert_smart(req: QueryRequest):
    prompt = generate_prompt_with_schema("insert", req.question)
    sql = ask_gpt(prompt, req.question)

    try:
        conn = pyodbc.connect(SQLSERVER_CONN_STR)
        cursor = conn.cursor()

        for stmt in sql.strip().split(";"):
            if stmt.strip():
                cursor.execute(stmt)

        conn.commit()
        conn.close()
        return {"message": "✅ Date inserate cu succes.", "sql": sql}

    except Exception as e:
        return {"error": str(e), "sql": sql}
