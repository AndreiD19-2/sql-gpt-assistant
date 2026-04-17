
from fastapi import APIRouter
from models import QueryRequest, SQLResponse
from services.gpt_service import ask_gpt
from services.sql_executor import execute_sql_query, is_query_safe
from services.query_logger import log_query
from prompts.prompt_generator import generate_prompt_with_schema

router = APIRouter()

@router.post("/procedure", response_model=SQLResponse)
async def create_procedure(req: QueryRequest):
    prompt = generate_prompt_with_schema("procedure", req.question)
    sql = ask_gpt(system_prompt=prompt, user_input=req.question)

    if not is_query_safe(sql):
        return SQLResponse(sql=sql, dangerous=True, error="Query-ul pare periculos. Confirmă manual.")

    result = execute_sql_query(sql)

    # Salvăm în istoric/log
    log_query(req.question, "procedure", sql, str(result), result.get("status", "unknown"))

    return SQLResponse(sql=sql, data=result if result["status"] == "success" else None, error=result.get("error"))
