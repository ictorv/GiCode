# 🚀 Code Dedup Resolver

An **AI-powered multi-agent system** that detects code duplication
across repositories, designs reusable shared libraries, estimates
business impact, and generates a safe migration plan --- with a
**privacy-first (MCP) layer**.

------------------------------------------------------------------------

## ✨ What this does

-   🔍 Finds duplicate logic across repos (language-agnostic)
-   🧩 Proposes a shared library (API + modules)
-   💰 Quantifies engineering time & cost savings
-   🛠 Produces a safe, phased migration plan (with rollback)
-   🔐 Ensures **no raw code** is sent to LLMs

------------------------------------------------------------------------

## 🧠 Architecture

    Client (UI / cURL / Postman)
            ↓
    FastAPI (dashboard/app.py)
            ↓
    Orchestrator (orchestrator/orchestrator.py)
            ↓
    ┌─────────────────────────────────────────────┐
    │ 1) Code Analysis Agent                      │
    │ 2) Abstraction Agent                        │
    │ 3) Impact Assessment Agent                  │
    │ 4) Migration Agent                          │
    └─────────────────────────────────────────────┘
            ↓
    JSON Report (analysis + abstraction + impact + migration)

------------------------------------------------------------------------

## 🔁 End-to-End Flow

1.  **Input**
    -   Raw code blobs (`/api/analyze`) or GitHub repos
        (`/api/analyze-github`)
2.  **MCP Privacy Layer (`mcp/privacy_layer.py`)**
    -   Hashes identifiers (functions/classes)
    -   Removes strings & comments
    -   Extracts **structure only** (args, lines, returns)
3.  **Code Analysis Agent (`agents/code_analysis_agent.py`)**
    -   Language detection (Python/JS/TS/Java/Go/Ruby)
    -   Function extraction (AST/regex)
    -   Embeddings via `sentence-transformers`
    -   Cosine similarity → **duplicate pairs + severity**
4.  **Abstraction Agent (`agents/abstraction_agent.py`)**
    -   Designs **shared library** (modules, interfaces, signatures)
5.  **Impact Agent (`agents/impact_assessment_agent.py`)**
    -   Computes **monthly hours saved**, **annual \$ savings**,
        **migration effort**
    -   Transparent formula (review minutes × cycles × rate)
6.  **Migration Agent (`agents/migration_agent.py`)**
    -   Phases, tasks, success criteria
    -   Rollback plan, testing checklist, CI/CD changes
7.  **Orchestrator (`orchestrator/orchestrator.py`)**
    -   Runs agents sequentially and aggregates outputs

------------------------------------------------------------------------

## 📁 Project Structure

    .gic/
    ├── agents/
    │   ├── base_agent.py                # Groq LLM wrapper
    │   ├── code_analysis_agent.py      # Dup detection
    │   ├── abstraction_agent.py        # Library design
    │   ├── impact_assessment_agent.py  # Cost/benefit
    │   └── migration_agent.py          # Migration plan
    │
    ├── orchestrator/
    │   ├── orchestrator.py             # Pipeline runner
    │   └── json_utils.py               # Robust JSON parsing
    │
    ├── mcp/
    │   ├── privacy_layer.py            # Anonymization + structure
    │   └── mcp_server.py               # Optional MCP API
    │
    ├── integrations/
    │   └── github_connector.py         # Fetch repo code
    │
    ├── dashboard/
    │   └── app.py                      # FastAPI app
    │
    ├── tests/
    ├── pipeline_output.json
    ├── requirements.txt
    ├── Dockerfile
    ├── .env
    └── .gitignore

------------------------------------------------------------------------

## ⚙️ Local Setup

### 1) Clone

``` bash
git clone <your-repo-url>
cd .gic
```

### 2) Virtual env

``` bash
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

### 3) Install deps

``` bash
pip install -r requirements.txt
```

### 4) Environment

Create `.env`:

    GROQ_API_KEY=your_groq_api_key
    GITHUB_TOKEN=optional_token

> Uses Groq models like `llama-3.3-70b-versatile`.

------------------------------------------------------------------------

## ▶️ Run (Local)

``` bash
uvicorn dashboard.app:app --reload
```

Open: - http://127.0.0.1:8000/docs (Swagger UI)

------------------------------------------------------------------------

## 🔌 API Usage

### Analyze raw code

    POST /api/analyze

``` json
{
  "repos": {
    "repo-a": "def foo(...): ...",
    "repo-b": "def bar(...): ..."
  }
}
```

### Analyze GitHub repos

    POST /api/analyze-github

``` json
{
  "repos": ["owner/repo1", "owner/repo2"],
  "token": "",
  "file_pattern": "*.py"
}
```

### Health

    GET /api/health

------------------------------------------------------------------------

## 🧪 CLI Demo

``` bash
python orchestrator/orchestrator.py
```

Output → `pipeline_output.json`

------------------------------------------------------------------------

## 🔐 Privacy Model (MCP)

-   No raw code leaves your system
-   Identifiers hashed (`fn_<hash>`)
-   Strings/comments removed
-   Only structural metadata used for LLM prompts

------------------------------------------------------------------------

## 🧮 Cost Model (Impact Agent)

-   `monthly_review_hours = pairs × (15/60) × 2`
-   `annual_savings = monthly_hours × 12 × $75`
-   `migration_hours = pairs × 1 hr`

All values are returned in `computed_savings`.

------------------------------------------------------------------------

## 🐳 Docker Setup

### Dockerfile (example)

    FROM python:3.11-slim

    WORKDIR /app
    COPY requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt

    COPY . .

    ENV PYTHONUNBUFFERED=1
    ENV PORT=8000

    CMD ["uvicorn", "dashboard.app:app", "--host", "0.0.0.0", "--port", "8000"]

### Build image

``` bash
docker build -t code-dedup-resolver .
```

### Run container

``` bash
docker run -d \
  -p 8000:8000 \
  --name cdr \
  --env-file .env \
  code-dedup-resolver
```

### Test

-   http://localhost:8000/docs

------------------------------------------------------------------------

## 🧱 CI/CD (Suggested)

-   Lint: `flake8` / `ruff`
-   Tests: `pytest`
-   Build image on push
-   Deploy to:
    -   Docker Hub / GHCR
    -   Cloud (Render / AWS ECS / GCP Cloud Run)

------------------------------------------------------------------------

## 🧩 Extending the System

-   Add new language extractor in `code_analysis_agent.py`
-   Plug new LLM in `base_agent.py`
-   Add UI in `dashboard/frontend`
-   Stream results (WebSockets)

------------------------------------------------------------------------

## ⚠️ Limitations

-   Heuristic extraction for non-Python languages
-   Similarity threshold tuning may be required
-   Large repos limited to sampled files

------------------------------------------------------------------------

## 📈 Future Work

-   Visual dashboard (graphs for duplication)
-   Incremental scans (PR-based)
-   Auto-PR creation for migrations
-   Deeper AST-based matching across languages

------------------------------------------------------------------------

## 👨‍💻 Author

AI-driven system for **code analysis, refactoring, and cost
optimization**.
