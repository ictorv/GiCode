from fastapi import FastAPI
from pydantic import BaseModel
from privacy_layer import PrivacyLayer

app = FastAPI(title="MCP Privacy Server")
privacy = PrivacyLayer()


class CodePayload(BaseModel):
    repo: str
    code: str
    language: str = "python"


@app.post("/mcp/anonymize")
def anonymize(payload: CodePayload):
    anonymized = privacy.anonymize(payload.code, payload.language)
    structure = privacy.extract_structure(payload.code)
    return {
        "repo": payload.repo,
        "anonymized_code": anonymized,
        "structure": structure,
        "original_length": len(payload.code),
        "anonymized_length": len(anonymized),
    }


@app.get("/health")
def health():
    return {"status": "ok", "service": "MCP Privacy Layer"}