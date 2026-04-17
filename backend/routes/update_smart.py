from fastapi import APIRouter
from models import QueryRequest
from services.gpt_service import ask_gpt
from prompts.prompt_generator import generate_prompt_with_schema
from config import SQLSERVER_CONN_STR
import pyodbc

router = APIRouter()

@router.post("/update-smart")
def update_smart(req: QueryRequest):
    prompt = generate_prompt_with_schema("update", req.question)
    sql = ask_gpt(prompt, req.question)

    try:
        conn = pyodbc.connect(SQLSERVER_CONN_STR)
        cursor = conn.cursor()
        cursor.execute(sql)
        conn.commit()
        conn.close()
        return {"message": "✅ Date actualizate cu succes.", "sql": sql}
    except Exception as e:
        return {"error": str(e), "sql": sql}
