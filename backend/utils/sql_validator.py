# utils/sql_validator.py
import re

# Detectează comenzi periculoase în SQL
DANGEROUS_PATTERNS = [
    r"\bDROP\b",
    r"\bDELETE\b",
    r"\bTRUNCATE\b",
    r"\bALTER\b",
    r"\bUPDATE\b"
]

def is_dangerous_sql(sql: str) -> bool:
    sql_upper = sql.upper()
    return any(re.search(pattern, sql_upper) for pattern in DANGEROUS_PATTERNS)