from fastapi import APIRouter
from pydantic import BaseModel
from services.query_orchestrator import classify_intent, generate_sql_from_gpt

router = APIRouter()

class NLPQuery(BaseModel):
    query: str

@router.post("/nlp")
async def handle_nlp_query(nlp_query: NLPQuery):
    mode = classify_intent(nlp_query.query)
    sql = await generate_sql_from_gpt(mode, nlp_query.query)
    return {
        "mode": mode,
        "sql": sql
    }
