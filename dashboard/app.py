import sys
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

sys.path.insert(0, '../orchestrator')
sys.path.insert(0, '../integrations')

from orchestrator import run_pipeline

app = FastAPI(title="Code Dedup Resolver", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    repos: dict  # { "repo-name": "source code string" }


class GitHubRequest(BaseModel):
    repos: list   # ["owner/repo1", "owner/repo2"]
    token: str = ""
    file_pattern: str = "*.py"


@app.post("/api/analyze")
async def analyze(request: AnalyzeRequest):
    if not request.repos:
        raise HTTPException(400, "No repos provided")
    if len(request.repos) < 2:
        raise HTTPException(400, "Need at least 2 repos to compare")
    try:
        results = run_pipeline(request.repos)
        return results
    except Exception as e:
        raise HTTPException(500, f"Pipeline error: {str(e)}")


@app.post("/api/analyze-github")
async def analyze_github(request: GitHubRequest):
    """Pull code from GitHub and run analysis."""
    import requests as req

    repo_codes = {}
    fetch_log = []  # collect debug info per repo

    for repo_name in request.repos:
        if "/" not in repo_name:
            raise HTTPException(400, f"Invalid repo format '{repo_name}'. Use 'owner/repo'.")
        owner, repo = repo_name.split("/", 1)

        is_real_token = (
            request.token
            and not request.token.startswith("ghp_your")
            and len(request.token) > 10
        )
        headers = {"Authorization": f"token {request.token}"} if is_real_token else {}

        # Step 1: fetch file tree
        tree_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/HEAD?recursive=1"
        try:
            tree_resp = req.get(tree_url, headers=headers, timeout=15)
        except Exception as e:
            raise HTTPException(502, f"Network error reaching GitHub for '{repo_name}': {e}")

        if tree_resp.status_code == 401:
            raise HTTPException(401, "GitHub token is invalid or expired.")
        if tree_resp.status_code == 403:
            rate = tree_resp.headers.get("X-RateLimit-Remaining", "?")
            raise HTTPException(403,
                f"GitHub access forbidden for '{repo_name}'. "
                f"Rate limit remaining: {rate}. "
                "If 0, wait 60 min or use a valid token.")
        if tree_resp.status_code == 404:
            raise HTTPException(404, f"Repo '{repo_name}' not found or is private.")
        if tree_resp.status_code != 200:
            fetch_log.append({
                "repo": repo_name,
                "status": tree_resp.status_code,
                "reason": tree_resp.text[:200]
            })
            continue

        # Step 2: filter .py files
        tree = tree_resp.json()
        all_blobs = [
            item for item in tree.get("tree", [])
            if item["type"] == "blob"
            and item["path"].endswith(".py")
            and not any(skip in item["path"]
                        for skip in ["test_", "_test", "migrations", "vendor"])
        ]

        fetch_log.append({
            "repo": repo_name,
            "tree_status": 200,
            "py_files_found": len(all_blobs),
            "files_to_fetch": min(len(all_blobs), 20)
        })

        if not all_blobs:
            continue

        # Step 3: download file contents
        code_parts = []
        for item in all_blobs[:20]:
            raw_url = (
                f"https://raw.githubusercontent.com/{owner}/{repo}/HEAD/{item['path']}"
            )
            r = req.get(raw_url, headers=headers, timeout=10)
            if r.status_code == 200:
                code_parts.append(f"# File: {item['path']}\n{r.text}")

        if code_parts:
            repo_codes[repo_name] = "\n\n".join(code_parts)

    
    if len(repo_codes) < 2:
        raise HTTPException(400, {
            "error": "Could not fetch at least 2 repos.",
            "repos_successfully_fetched": list(repo_codes.keys()),
            "fetch_log": fetch_log,
            "tip": (
                "Check: (1) repo names are 'owner/repo', "
                "(2) repos are public or token has access, "
                "(3) repos contain .py files outside test/vendor folders."
            )
        })

    results = run_pipeline(repo_codes)
    results["fetch_log"] = fetch_log
    return results


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "Code Dedup Resolver"}


@app.get("/api/demo")
def demo():
    return {
        "message": "POST to /api/analyze with repos dict to run real analysis",
        "example_request": {
            "repos": {
                "repo-a": "def validate_email(email):\n    import re\n    ...",
                "repo-b": "def check_email(addr):\n    import re\n    ..."
            }
        }
    }