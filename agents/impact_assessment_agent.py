import json
import sys

sys.path.insert(0, '../orchestrator')   # so we can import json_utils

from base_agent import call_llm
from json_utils import parse_llm_json

SYSTEM = """You are an expert Impact Assessment Agent.
You quantify the business value of code consolidation using real metrics.
You provide honest risk assessments. Always respond with valid JSON only."""

# ---------------------------------------------------------------------------
# Cost model — kept intentionally conservative and transparent.
#
# ENGINEER_HOURLY_RATE_USD
#   Blended rate covering salary + overhead (India/US mixed teams ≈ $60–90/hr).
#
# REVIEW_MINUTES_PER_DUPLICATE_FUNCTION
#   How long an engineer spends on a SINGLE duplicate function per code-review
#   cycle (understand context, check for drift, decide which copy to trust).
#   Empirically ~15 min per duplicate function per review round.
#
# REVIEW_CYCLES_PER_MONTH
#   Typical PR cadence — a shared utility tends to be touched ~2×/month.
#
# MIGRATION_HOURS_PER_FILE
#   Conservative estimate: read file, replace calls, run tests, raise PR — ~1 hr.
#   Used for estimating migration effort.
# ---------------------------------------------------------------------------
ENGINEER_HOURLY_RATE_USD       = 75       # $/hr blended
REVIEW_MINUTES_PER_DUPLICATE   = 15       # min per duplicate function per review
REVIEW_CYCLES_PER_MONTH        = 2        # PR cycles / month that touch shared utils
MIGRATION_HOURS_PER_FILE       = 1.0      # hrs to migrate one file to shared lib


def calculate_savings(duplicate_pairs: list, repo_count: int) -> dict:
    """
    Formula (shown in output so it's auditable):

      monthly_review_hours = num_duplicate_pairs
                             × (REVIEW_MINUTES_PER_DUPLICATE / 60)
                             × REVIEW_CYCLES_PER_MONTH

      annual_usd_saved     = monthly_review_hours × 12 × ENGINEER_HOURLY_RATE_USD

      migration_hours      = num_duplicate_pairs × MIGRATION_HOURS_PER_FILE
                             (one-time cost, not recurring)

      migration_days       = ceil(migration_hours / 6)   # 6 productive hrs/day
    """
    import math

    total_pairs = len(duplicate_pairs)
    if total_pairs == 0:
        return {
            "monthly_review_hours_saved": 0,
            "annual_usd_saved": 0,
            "lines_eliminated": 0,
            "duplicate_pairs": 0,
            "migration_hours_one_time": 0,
            "migration_days_one_time": 0,
            "formula_used": "No duplicates found — all zeros.",
        }

    # Total duplicate lines (just for reporting; not used in cost calc)
    lines_eliminated = sum(
        (p.get("fn_a", {}).get("lines", 10) + p.get("fn_b", {}).get("lines", 10)) / 2
        for p in duplicate_pairs
    )

    monthly_review_hours = total_pairs * (REVIEW_MINUTES_PER_DUPLICATE / 60) * REVIEW_CYCLES_PER_MONTH
    annual_usd_saved     = monthly_review_hours * 12 * ENGINEER_HOURLY_RATE_USD
    migration_hours      = total_pairs * MIGRATION_HOURS_PER_FILE
    migration_days       = math.ceil(migration_hours / 6)

    formula_explanation = (
        f"{total_pairs} duplicate pairs "
        f"× {REVIEW_MINUTES_PER_DUPLICATE} min/review "
        f"× {REVIEW_CYCLES_PER_MONTH} reviews/month "
        f"= {round(monthly_review_hours, 1)} hrs/month saved. "
        f"× 12 months × ${ENGINEER_HOURLY_RATE_USD}/hr "
        f"= ${round(annual_usd_saved):,}/yr. "
        f"Migration: {total_pairs} files × {MIGRATION_HOURS_PER_FILE} hr "
        f"= {round(migration_hours, 1)} hrs ≈ {migration_days} day(s)."
    )

    return {
        "monthly_review_hours_saved": round(monthly_review_hours, 1),
        "annual_usd_saved": round(annual_usd_saved),
        "lines_eliminated": round(lines_eliminated),
        "duplicate_pairs": total_pairs,
        "migration_hours_one_time": round(migration_hours, 1),
        "migration_days_one_time": migration_days,
        "formula_used": formula_explanation,
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

Pre-calculated financial estimates (DO NOT recalculate — use these exact numbers):
{json.dumps(savings, indent=2)}

The formula used is already shown in the "formula_used" field above.
Use the pre-calculated values directly in your JSON response.

Return a full impact report as JSON:
{{
  "executive_summary": "2-3 sentence summary for leadership",
  "financial_impact": {{
    "annual_savings_usd": {savings["annual_usd_saved"]},
    "monthly_review_hours_saved": {savings["monthly_review_hours_saved"]},
    "lines_eliminated": {savings["lines_eliminated"]},
    "migration_hours_one_time": {savings["migration_hours_one_time"]},
    "migration_days_one_time": {savings["migration_days_one_time"]},
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

    result = parse_llm_json(response)
    if result is None:
        result = {"raw_impact": response}

    # Always attach the auditable savings breakdown
    result["computed_savings"] = savings
    return result