# services/gpt_service.py
from openai import OpenAI
from config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def ask_gpt(system_prompt: str, user_input: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4.1-nano",  
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_input}
        ]
    )
    return response.choices[0].message.content.strip()
