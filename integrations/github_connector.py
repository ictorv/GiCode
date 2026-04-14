import os
import requests
from dotenv import load_dotenv

load_dotenv()


class GitHubConnector:
    """Plug-and-play GitHub integration."""

    def __init__(self, token: str = None):
        self.token = token or os.getenv("GITHUB_TOKEN", "")
        self.headers = {"Authorization": f"token {self.token}"} if self.token else {}
        self.base_url = "https://api.github.com"

    def get_repo_code(self, owner: str, repo: str,
                      extensions: list = None, max_files: int = 30) -> str:
        """Fetch all code files from a GitHub repo."""
        if extensions is None:
            extensions = [".py", ".js", ".ts", ".java", ".go"]

        tree_url = f"{self.base_url}/repos/{owner}/{repo}/git/trees/HEAD?recursive=1"
        resp = requests.get(tree_url, headers=self.headers, timeout=15)
        resp.raise_for_status()

        tree = resp.json()
        code_parts = []
        count = 0

        for item in tree.get("tree", []):
            if count >= max_files:
                break
            if item["type"] != "blob":
                continue
            if not any(item["path"].endswith(ext) for ext in extensions):
                continue
            if any(skip in item["path"] for skip in ["test_", "_test", "migrations", "vendor"]):
                continue

            raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/HEAD/{item['path']}"
            r = requests.get(raw_url, headers=self.headers, timeout=10)
            if r.status_code == 200 and len(r.text) < 50000:
                code_parts.append(f"# === FILE: {item['path']} ===\n{r.text}")
                count += 1

        return "\n\n".join(code_parts)

    def list_repos(self, org: str = None, user: str = None) -> list:
        """List repositories for an org or user."""
        if org:
            url = f"{self.base_url}/orgs/{org}/repos?per_page=50"
        elif user:
            url = f"{self.base_url}/users/{user}/repos?per_page=50"
        else:
            url = f"{self.base_url}/user/repos?per_page=50"

        resp = requests.get(url, headers=self.headers, timeout=15)
        resp.raise_for_status()
        return [r["full_name"] for r in resp.json()]