import json
import sys

sys.path.insert(0, '../orchestrator')   # so we can import json_utils

from base_agent import call_llm
from json_utils import parse_llm_json

SYSTEM = """You are an expert Impact Assessment Agent.
You quantify the business value of code consolidation using real metrics.
You provide honest risk assessments. Always respond with valid JSON only."""

ENGINEER_HOURLY_RATE_USD = 75
HOURS_PER_LOC_PER_MONTH = 0.04


def calculate_savings(duplicate_pairs: list, repo_count: int) -> dict:
    total_pairs = len(duplicate_pairs)
    if total_pairs == 0:
        return {"monthly_hours_saved": 0, "annual_usd_saved": 0, "lines_eliminated": 0}

    avg_lines = sum(
        (p.get("fn_a", {}).get("lines", 30) + p.get("fn_b", {}).get("lines", 30)) / 2
        for p in duplicate_pairs
    ) / total_pairs if total_pairs else 30

    lines_to_eliminate = avg_lines * total_pairs * (repo_count - 1)
    monthly_hours = lines_to_eliminate * HOURS_PER_LOC_PER_MONTH
    annual_usd = monthly_hours * ENGINEER_HOURLY_RATE_USD * 12

    return {
        "monthly_hours_saved": round(monthly_hours, 1),
        "annual_usd_saved": round(annual_usd),
        "lines_eliminated": round(lines_to_eliminate),
        "duplicate_pairs": total_pairs,
    }


def run(analysis: dict, abstraction: dict) -> dict:
    savings = calculate_savings(
        analysis.get("raw_pairs", []),
        len(analysis.get("repos", []))
    )

    user_prompt = f"""Assess the impact of consolidating duplicated code into a shared library.

Duplication Analysis:
{json.dumps({k: v for k, v in analysis.items() if k != 'raw_pairs'}, indent=2)}

Proposed Library:
{json.dumps(abstraction, indent=2)}

Pre-calculated financial estimates:
{json.dumps(savings, indent=2)}

Return a full impact report as JSON:
{{
  "executive_summary": "2-3 sentence summary for leadership",
  "financial_impact": {{
    "annual_savings_usd": 0,
    "monthly_hours_saved": 0,
    "lines_eliminated": 0,
    "payback_period_weeks": 0
  }},
  "technical_benefits": ["benefit 1", "benefit 2"],
  "risks": [
    {{"risk": "description", "likelihood": "high/medium/low", "mitigation": "how to handle"}}
  ],
  "tech_debt_score_before": 0,
  "tech_debt_score_after": 0,
  "priority": "high/medium/low",
  "recommended_action": "description",
  "timeline_estimate_weeks": 0
}}"""

    response = call_llm(SYSTEM, user_prompt)

    # ✅ FIX: use parse_llm_json to handle ```json ... ``` fences from LLM
    result = parse_llm_json(response)
    if result is None:
        result = {"raw_impact": response}

    result["computed_savings"] = savings
    return result