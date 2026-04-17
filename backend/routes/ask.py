from fastapi import APIRouter
from models import QueryRequest, SQLResponse
from services.gpt_service import ask_gpt
from utils.sql_validator import is_dangerous_sql
from prompts.prompt_generator import generate_prompt_with_schema
from services.sql_executor import execute_sql_query as run_sql
from services.query_logger import log_query  # ✅ adăugat

router = APIRouter()

@router.post("/ask", response_model=SQLResponse)
async def ask(req: QueryRequest):
    prompt = generate_prompt_with_schema("select", req.question)
    sql = ask_gpt(system_prompt=prompt, user_input=req.question)

    if is_dangerous_sql(sql):
        return SQLResponse(sql=sql, dangerous=True, error="Query-ul pare periculos. Confirmă manual înainte de execuție.")

    try:
        data = run_sql(sql)
        log_query(
            user_input=req.question,
            mode="select",
            sql=sql,
            result=str(data),
            status="success",
            message=data.get("message") if isinstance(data, dict) else None  # suport GPT messages
        )
        return SQLResponse(sql=sql, data=data)
    except Exception as e:
        log_query(req.question, "select", sql, str(e), "error")
        return SQLResponse(sql=sql, error=str(e))
