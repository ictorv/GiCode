# test_keys.py
import os
from dotenv import load_dotenv

load_dotenv()

# Test Groq
print("Testing Groq API...")
try:
    from groq import Groq
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": "Say hello in one word"}],
        max_tokens=10,
    )
    print(f"Groq OK — Response: {response.choices[0].message.content}")
except Exception as e:
    print(f"Groq FAILED: {e}")

# Test GitHub
print("\nTesting GitHub Token...")
try:
    import requests
    r = requests.get(
        "https://api.github.com/user",
        headers={"Authorization": f"token {os.getenv('GITHUB_TOKEN')}"}
    )
    if r.status_code == 200:
        print(f"GitHub OK — Logged in as: {r.json()['login']}")
    else:
        print(f"GitHub FAILED: Status {r.status_code} — {r.json().get('message')}")
except Exception as e:
    print(f"GitHub FAILED: {e}")