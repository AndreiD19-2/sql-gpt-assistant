from fastapi import APIRouter, Response, HTTPException
from models import QueryRequest
from prompts.static_prompts import PROMPT_SELECT
from services.gpt_service import ask_gpt
from services.sql_executor import run_sql
from utils.csv_exporter import export_to_csv

router = APIRouter()

@router.post("/export-csv")
def export_csv(req: QueryRequest):
    # 1. Trimite întrebarea la GPT pentru a genera SQL-ul
    sql = ask_gpt(PROMPT_SELECT, req.question)

    try:
        # 2. Rulează SQL-ul și obține datele
        data = run_sql(sql)

        if not data:
            raise HTTPException(status_code=204, detail="Nicio înregistrare găsită.")

        # 3. Generează CSV
        csv_data = export_to_csv(data)

        # 4. Returnează ca fișier atașat
        return Response(
            content=csv_data,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=result.csv"}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Eroare export CSV: {str(e)}")
