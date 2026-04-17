

from pydantic import BaseModel
from typing import Optional, Union, Dict, List, Any

# ✅ Request: cererea trimisă de utilizator
class QueryRequest(BaseModel):
    question: str

# ✅ Response: răspunsul de la endpointurile SQL/NLP
class SQLResponse(BaseModel):
    sql: Optional[str] = None
    data: Optional[Union[Dict[str, Any], List[Any]]] = None  # ✅ acceptă dict cu rows + columns
    error: Optional[str] = None
    message: Optional[str] = None
    dangerous: Optional[bool] = False
