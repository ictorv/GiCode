import json
import re


def parse_llm_json(response: str) -> dict:
    """
    Safely parse JSON from LLM responses that may be wrapped
    in markdown code fences like ```json ... ``` or ``` ... ```
    """
    # Strip markdown code fences
    cleaned = re.sub(r"^```(?:json)?\s*", "", response.strip(), flags=re.MULTILINE)
    cleaned = re.sub(r"\s*```$", "", cleaned.strip(), flags=re.MULTILINE)
    cleaned = cleaned.strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Fallback: extract first {...} block found anywhere in string
        match = re.search(r"\{[\s\S]*\}", cleaned)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass
    return None  # Caller must handle None as fallback