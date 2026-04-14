import json
import ast
import hashlib
import sys

sys.path.insert(0, '../mcp')
sys.path.insert(0, '../orchestrator')   # so we can import json_utils

from sentence_transformers import SentenceTransformer, util
from base_agent import call_llm
from privacy_layer import PrivacyLayer
from json_utils import parse_llm_json

_embedder = SentenceTransformer('all-MiniLM-L6-v2')
_privacy = PrivacyLayer()

SYSTEM = """You are an expert Code Analysis Agent.
You detect duplication patterns from anonymized code structures.
You never reveal or reconstruct proprietary implementations.
Always respond with valid JSON only."""


def extract_functions(code: str, repo: str) -> list:
    functions = []
    try:
        tree = ast.parse(code)
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                args = [a.arg for a in node.args.args]
                docstring = ast.get_docstring(node) or ""
                functions.append({
                    "repo": repo,
                    "name": node.name,
                    "name_hash": hashlib.sha256(node.name.encode()).hexdigest()[:10],
                    "args": args,
                    "arg_count": len(args),
                    "line_count": (node.end_lineno or 0) - node.lineno,
                    "docstring": docstring[:100],
                    "has_return": any(isinstance(n, ast.Return) for n in ast.walk(node)),
                })
    except Exception:
        pass
    return functions


def find_similar_pairs(repo_codes: dict) -> list:
    all_fns = []
    for repo, code in repo_codes.items():
        fns = extract_functions(code, repo)
        all_fns.extend(fns)

    if len(all_fns) < 2:
        return []

    signatures = [
        f"{fn['name']} args:{fn['arg_count']} lines:{fn['line_count']} {fn['docstring']}"
        for fn in all_fns
    ]
    embeddings = _embedder.encode(signatures, convert_to_tensor=True)

    pairs = []
    for i in range(len(all_fns)):
        for j in range(i + 1, len(all_fns)):
            if all_fns[i]["repo"] == all_fns[j]["repo"]:
                continue
            score = float(util.cos_sim(embeddings[i], embeddings[j]))
            if score > 0.78:
                pairs.append({
                    "fn_a": {"repo": all_fns[i]["repo"], "hash": all_fns[i]["name_hash"],
                             "args": all_fns[i]["arg_count"], "lines": all_fns[i]["line_count"]},
                    "fn_b": {"repo": all_fns[j]["repo"], "hash": all_fns[j]["name_hash"],
                             "args": all_fns[j]["arg_count"], "lines": all_fns[j]["line_count"]},
                    "similarity_score": round(score, 3),
                    "severity": "high" if score > 0.92 else "medium" if score > 0.85 else "low",
                })
    return sorted(pairs, key=lambda x: x["similarity_score"], reverse=True)


def run(repo_codes: dict) -> dict:
    """
    Main entry point.
    repo_codes = { "repo-name": "python source code string", ... }
    """
    # Step 1: anonymize all code via MCP privacy layer
    anonymized = {repo: _privacy.anonymize(code) for repo, code in repo_codes.items()}

    # Step 2: compute similarity without sending code to LLM
    similar_pairs = find_similar_pairs(repo_codes)

    # Step 3: only send structural summary (no actual code) to LLM
    summary_for_llm = {
        "repos_analyzed": list(repo_codes.keys()),
        "total_functions_found": sum(len(extract_functions(c, r)) for r, c in repo_codes.items()),
        "duplicate_pairs": similar_pairs[:10],  # top 10 only
    }

    analysis_text = call_llm(
        system_prompt=SYSTEM,
        user_prompt=f"""Analyze these code duplication patterns found across repositories.
Note: function names are hashed for privacy. Focus on structural patterns.

{json.dumps(summary_for_llm, indent=2)}

Return JSON with:
{{
  "summary": "brief description of duplication problem",
  "top_patterns": [{{"pattern_type": "...", "severity": "high/medium/low", "repos_affected": [...], "estimated_duplicate_lines": 0}}],
  "total_duplicate_pairs": 0,
  "risk_level": "high/medium/low",
  "recommendation": "brief action recommendation"
}}"""
    )

    # ✅ FIX: use parse_llm_json to handle ```json ... ``` fences from LLM
    result = parse_llm_json(analysis_text)
    if result is None:
        result = {"raw_analysis": analysis_text, "duplicate_pairs_found": len(similar_pairs)}

    result["raw_pairs"] = similar_pairs
    result["repos"] = list(repo_codes.keys())
    return result