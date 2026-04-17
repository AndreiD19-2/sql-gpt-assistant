from fastapi import APIRouter
from models import QueryRequest
from prompts.static_prompts import PROMPT_EXPLAIN
from services.gpt_service import ask_gpt

router = APIRouter()

@router.post("/explain")
async def explain_query(req: QueryRequest):
    full_prompt = f"{PROMPT_EXPLAIN}\n\nQuery:\n{req.question}"
    explanation = ask_gpt(PROMPT_EXPLAIN, req.question)
    return {"explanation": explanation}
