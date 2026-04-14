import json
import sys

sys.path.insert(0, '../orchestrator')   # so we can import json_utils

from base_agent import call_llm
from json_utils import parse_llm_json

SYSTEM = """You are an expert Migration Planning Agent.
You create detailed, safe, step-by-step plans for migrating to shared code libraries.
You always include rollback strategies and testing requirements.
Always respond with valid JSON only."""


def run(analysis: dict, abstraction: dict, impact: dict) -> dict:
    user_prompt = f"""Create a complete migration plan for consolidating duplicated code.

Analysis: {json.dumps({k: v for k, v in analysis.items() if k != 'raw_pairs'}, indent=2)}
Library Design: {json.dumps(abstraction, indent=2)}
Impact Assessment: {json.dumps({k: v for k, v in impact.items() if k != 'computed_savings'}, indent=2)}

Return a detailed migration plan as JSON:
{{
  "plan_name": "Migration to shared-lib",
  "total_estimated_days": 0,
  "phases": [
    {{
      "phase_number": 1,
      "name": "Phase name",
      "description": "what happens",
      "estimated_days": 0,
      "tasks": ["task 1", "task 2"],
      "success_criteria": ["criterion 1"],
      "rollback_step": "how to undo if needed"
    }}
  ],
  "testing_checklist": ["test 1", "test 2"],
  "rollback_strategy": "overall rollback approach",
  "team_requirements": {{
    "engineers": 0,
    "reviewers": 0,
    "estimated_total_hours": 0
  }},
  "sample_pr_description": "markdown PR description template",
  "ci_cd_changes": ["change 1", "change 2"],
  "communication_plan": "how to announce to teams"
}}"""

    response = call_llm(SYSTEM, user_prompt)

    # ✅ FIX: use parse_llm_json to handle ```json ... ``` fences from LLM
    result = parse_llm_json(response)
    if result is None:
        return {"raw_migration_plan": response}
    return result