# backend/routes/advanced_router.py

from fastapi import APIRouter
from pydantic import BaseModel
from models import SQLResponse
from services.gpt_service import ask_gpt
from prompts.prompt_generator import generate_prompt_with_schema
from services.query_logger import log_query

router = APIRouter()

class AdvancedQuery(BaseModel):
    mode: str
    question: str

@router.post("/advanced", response_model=SQLResponse)
async def handle_advanced(req: AdvancedQuery):
    prompt = generate_prompt_with_schema(req.mode, req.question)
    gpt_response = ask_gpt(system_prompt=prompt, user_input=req.question)

    log_query(
        user_input=req.question,
        mode=req.mode,
        sql=gpt_response,
        result=gpt_response,
        status="success"
    )

    return SQLResponse(sql=gpt_response, message=gpt_response)
