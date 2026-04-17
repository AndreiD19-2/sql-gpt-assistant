from fastapi import APIRouter
from models import QueryRequest, SQLResponse
from prompts.static_prompts import PROMPT_DDL
from services.gpt_service import ask_gpt
from services.sql_executor import run_sql
from utils.sql_validator import is_dangerous_sql

router = APIRouter()

@router.post("/ddl", response_model=SQLResponse)
async def generate_ddl(req: QueryRequest):
    ddl_sql = ask_gpt(PROMPT_DDL, req.question)
    
    # Validare de siguranță (opțională)
    if is_dangerous_sql(ddl_sql):
        return SQLResponse(sql=ddl_sql, dangerous=True, error="Query-ul DDL generat necesită aprobare manuală.")

    try:
        run_sql(ddl_sql)
        return SQLResponse(sql=ddl_sql, data=[{"status": "Executed successfully"}])
    except Exception as e:
        return SQLResponse(sql=ddl_sql, error=str(e))
