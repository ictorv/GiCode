import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Groq free API - supported models:
# llama3-70b-8192 (best quality, free)
# mixtral-8x7b-32768 (good for code, free)
# llama3-8b-8192 (fastest, free)

GROQ_MODEL = "llama-3.3-70b-versatile"

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def call_llm(system_prompt: str, user_prompt: str, max_tokens: int = 2048) -> str:
    """Unified Groq API call used by all agents."""
    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        max_tokens=max_tokens,
        temperature=0.2,
    )
    return response.choices[0].message.content