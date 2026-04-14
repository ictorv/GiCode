import json
import sys

sys.path.insert(0, '../orchestrator')   # so we can import json_utils

from base_agent import call_llm
from json_utils import parse_llm_json

SYSTEM = """You are an expert Software Abstraction Agent.
You design clean, reusable shared library APIs based on duplication analysis.
You always think about backward compatibility and dependency injection.
Always respond with valid JSON only."""


def run(analysis: dict) -> dict:
    user_prompt = f"""Based on this code duplication analysis, design a shared library API.

Analysis summary:
{json.dumps(analysis, indent=2)}

Design a shared library that resolves this duplication. Return JSON:
{{
  "library_name": "suggested-package-name",
  "version": "1.0.0",
  "description": "what this library does",
  "modules": [
    {{
      "module_name": "module.submodule",
      "purpose": "what it does",
      "interfaces": [
        {{
          "name": "function_or_class_name",
          "signature": "def name(param: Type, ...) -> ReturnType",
          "description": "what it does",
          "replaces_in_repos": ["repo-a", "repo-b"]
        }}
      ]
    }}
  ],
  "installation": "pip install suggested-package-name",
  "design_principles": ["principle 1", "principle 2"],
  "estimated_loc_reduction": 0
}}"""

    response = call_llm(SYSTEM, user_prompt)

    # ✅ FIX: use parse_llm_json to handle ```json ... ``` fences from LLM
    result = parse_llm_json(response)
    if result is None:
        return {"raw_design": response, "library_name": "shared-utilities"}
    return result