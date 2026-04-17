# backend/routes/dictionary_router.py

from fastapi import APIRouter
from models import QueryRequest, SQLResponse
from services.gpt_service import ask_gpt
from services.query_logger import log_query
from prompts.prompt_generator import generate_prompt_with_schema

router = APIRouter()

@router.post("/sql-dictionary", response_model=SQLResponse)
async def explain_sql(req: QueryRequest):
    prompt = generate_prompt_with_schema("dictionary", req.question)
    explanation = ask_gpt(system_prompt=prompt, user_input=req.question)

    log_query(req.question, "dictionary", explanation, explanation, "success")

    return SQLResponse(sql=None, message=explanation)
