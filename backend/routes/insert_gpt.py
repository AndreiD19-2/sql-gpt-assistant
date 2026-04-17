# routes/insert_gpt.py
from fastapi import APIRouter
from models import QueryRequest
from services.gpt_service import ask_gpt
from prompts.static_prompts import PROMPT_INSERT
from config import SQLSERVER_CONN_STR
import pyodbc

router = APIRouter()

@router.post("/insert-from-gpt")
def insert_data_from_gpt(req: QueryRequest):
    # Generează SQL cu GPT
    sql = ask_gpt(PROMPT_INSERT, req.question)

    try:
        conn = pyodbc.connect(SQLSERVER_CONN_STR)
        cursor = conn.cursor()

        # Execută fiecare INSERT separat
        for stmt in sql.strip().split(";"):
            if stmt.strip():
                cursor.execute(stmt)

        conn.commit()
        conn.close()
        return {"message": "✅ Date inserate cu succes.", "sql": sql}
    except Exception as e:
        return {"error": str(e), "sql": sql}
