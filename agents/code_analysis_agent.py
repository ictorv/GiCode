import json
import ast
import hashlib
import re
import sys

sys.path.insert(0, '../mcp')
sys.path.insert(0, '../orchestrator')

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

# ---------------------------------------------------------------------------
# Language detection helpers
# ---------------------------------------------------------------------------

def _detect_language(code: str, repo: str = "") -> str:
    """Best-effort language detection from code content or repo hints."""
    repo_lower = repo.lower()
    if any(ext in repo_lower for ext in [".js", "-js", "_js", "javascript", "node"]):
        return "javascript"
    if any(ext in repo_lower for ext in [".ts", "-ts", "_ts", "typescript"]):
        return "typescript"
    if any(ext in repo_lower for ext in [".java", "java"]):
        return "java"
    if any(ext in repo_lower for ext in [".go", "golang"]):
        return "go"
    if any(ext in repo_lower for ext in [".rb", "ruby"]):
        return "ruby"

    # Sniff by syntax patterns
    if re.search(r'\bfunc\s+\w+\s*\(', code):
        return "go"
    if re.search(r'\bpublic\s+(static\s+)?\w+\s+\w+\s*\(', code):
        return "java"
    if re.search(r'\bdef\s+\w+', code) and re.search(r'^\s*end\s*$', code, re.MULTILINE):
        return "ruby"
    if re.search(r'\b(const|let|var)\s+\w+\s*=\s*(async\s*)?\(', code) or \
       re.search(r'\bfunction\s+\w+\s*\(', code):
        return "javascript"
    if re.search(r':\s*(str|int|float|bool|list|dict|None)\b', code) or \
       re.search(r'\bdef\s+\w+\s*\(', code):
        return "python"

    return "generic"


# ---------------------------------------------------------------------------
# Per-language function extractors
# ---------------------------------------------------------------------------

def _extract_python(code: str, repo: str) -> list:
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
                    "language": "python",
                })
    except Exception:
        pass
    return functions


def _extract_via_regex(code: str, repo: str, language: str) -> list:
    """
    Regex-based extractor for JS/TS/Java/Go/Ruby/generic.
    Captures name + approximate line count for each function/method.
    """
    patterns = {
        # JS/TS: function foo(...) {  OR  const foo = (...) => {  OR  async foo(...) {
        "javascript": [
            r'(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)',
            r'(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>',
            r'(?:async\s+)?(\w+)\s*\(([^)]*)\)\s*\{',   # method shorthand
        ],
        "typescript": [
            r'(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)',
            r'(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>',
            r'(?:public|private|protected)?\s*(?:async\s+)?(\w+)\s*\(([^)]*)\)\s*[:{]',
        ],
        "java": [
            r'(?:public|private|protected|static|\s)+[\w<>\[\]]+\s+(\w+)\s*\(([^)]*)\)\s*(?:throws\s+\w+\s*)?\{',
        ],
        "go": [
            r'func\s+(?:\(\w+\s+\*?\w+\)\s+)?(\w+)\s*\(([^)]*)\)',
        ],
        "ruby": [
            r'def\s+(\w+[?!]?)\s*(?:\(([^)]*)\))?',
        ],
        "generic": [
            r'(?:function|def|func)\s+(\w+)\s*\(([^)]*)\)',
        ],
    }

    chosen_patterns = patterns.get(language, patterns["generic"])
    lines = code.splitlines()
    functions = []
    seen = set()

    for pattern in chosen_patterns:
        for m in re.finditer(pattern, code, re.MULTILINE):
            name = m.group(1)
            if name in seen or name in ("if", "for", "while", "switch", "catch"):
                continue
            seen.add(name)

            raw_args = m.group(2) if m.lastindex >= 2 else ""
            arg_count = len([a for a in raw_args.split(",") if a.strip()]) if raw_args.strip() else 0

            # Estimate line count by counting from match to next closing brace/def
            start_line = code[:m.start()].count("\n")
            # Rough heuristic: scan forward up to 60 lines for end of block
            block = "\n".join(lines[start_line: start_line + 60])
            brace_depth = 0
            line_count = 5  # fallback
            for idx, ch in enumerate(block):
                if ch == "{":
                    brace_depth += 1
                elif ch == "}":
                    brace_depth -= 1
                    if brace_depth == 0:
                        line_count = block[:idx].count("\n") + 1
                        break

            functions.append({
                "repo": repo,
                "name": name,
                "name_hash": hashlib.sha256(name.encode()).hexdigest()[:10],
                "arg_count": arg_count,
                "line_count": line_count,
                "docstring": "",
                "has_return": bool(re.search(r'\breturn\b', block)),
                "language": language,
            })

    return functions


def extract_functions(code: str, repo: str) -> list:
    """Auto-detect language and extract function metadata."""
    lang = _detect_language(code, repo)
    if lang == "python":
        result = _extract_python(code, repo)
        # If AST parse failed or returned nothing, fall back to regex
        if not result:
            result = _extract_via_regex(code, repo, "python")
        return result
    return _extract_via_regex(code, repo, lang)


# ---------------------------------------------------------------------------
# Similarity search (unchanged logic, language-aware label added)
# ---------------------------------------------------------------------------

def find_similar_pairs(repo_codes: dict) -> list:
    all_fns = []
    for repo, code in repo_codes.items():
        fns = extract_functions(code, repo)
        all_fns.extend(fns)

    if len(all_fns) < 2:
        return []

    signatures = [
        f"{fn['name']} args:{fn['arg_count']} lines:{fn['line_count']} {fn.get('docstring', '')}"
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
                    "fn_a": {
                        "repo": all_fns[i]["repo"],
                        "hash": all_fns[i]["name_hash"],
                        "args": all_fns[i]["arg_count"],
                        "lines": all_fns[i]["line_count"],
                        "language": all_fns[i].get("language", "unknown"),
                    },
                    "fn_b": {
                        "repo": all_fns[j]["repo"],
                        "hash": all_fns[j]["name_hash"],
                        "args": all_fns[j]["arg_count"],
                        "lines": all_fns[j]["line_count"],
                        "language": all_fns[j].get("language", "unknown"),
                    },
                    "similarity_score": round(score, 3),
                    "severity": "high" if score > 0.92 else "medium" if score > 0.85 else "low",
                })
    return sorted(pairs, key=lambda x: x["similarity_score"], reverse=True)


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def run(repo_codes: dict) -> dict:
    """
    Main entry point.
    repo_codes = { "repo-name": "source code string", ... }
    Supports Python, JavaScript, TypeScript, Java, Go, Ruby, and generic code.
    """
    # Step 1: anonymize all code via MCP privacy layer
    anonymized = {repo: _privacy.anonymize(code) for repo, code in repo_codes.items()}

    # Step 2: compute similarity without sending code to LLM
    similar_pairs = find_similar_pairs(repo_codes)

    # Step 3: only send structural summary (no actual code) to LLM
    languages_detected = {
        repo: _detect_language(code, repo)
        for repo, code in repo_codes.items()
    }

    summary_for_llm = {
        "repos_analyzed": list(repo_codes.keys()),
        "languages_detected": languages_detected,
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

    result = parse_llm_json(analysis_text)
    if result is None:
        result = {"raw_analysis": analysis_text, "duplicate_pairs_found": len(similar_pairs)}

    result["raw_pairs"] = similar_pairs
    result["repos"] = list(repo_codes.keys())
    result["languages_detected"] = languages_detected
    return result