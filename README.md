<div align="center">

```
 ██████╗ ██╗ ██████╗ ██████╗ ██████╗ ███████╗
██╔════╝ ██║██╔════╝██╔═══██╗██╔══██╗██╔════╝
██║  ███╗██║██║     ██║   ██║██║  ██║█████╗  
██║   ██║██║██║     ██║   ██║██║  ██║██╔══╝  
╚██████╔╝██║╚██████╗╚██████╔╝██████╔╝███████╗
 ╚═════╝ ╚═╝ ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝
```

**Multi-Agent Code Deduplication and Consolidation System**

[![Python](https://img.shields.io/badge/Python-3.10+-1a1a2e?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-1a1a2e?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Groq](https://img.shields.io/badge/LLM-Groq_LLaMA_3.3_70B-1a1a2e?style=flat-square&logo=meta&logoColor=white)](https://groq.com)
[![License](https://img.shields.io/badge/License-MIT-1a1a2e?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production_Ready-00ff88?style=flat-square)]()

</div>

---

## What This System Does

GICODE is a **four-agent autonomous pipeline** that scans multiple codebases, detects semantically duplicated functions across repositories, designs a shared library to consolidate them, quantifies the financial impact of doing so, and produces a complete migration plan — all without ever exposing proprietary code to an external LLM.

It is designed for engineering teams managing multiple services that have grown independently and accumulated invisible redundancy — the kind that shows up in review fatigue, diverging bug fixes, and duplicated test suites.

---

## Architecture Overview

```
                         INPUT
              ┌─────────────────────────┐
              │  Source Code (2+ repos)  │
              │  or GitHub owner/repo    │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │     MCP Privacy Layer    │
              │  Anonymizes code before  │
              │  any LLM interaction     │
              └────────────┬────────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
     ┌────────────┐  ┌──────────┐  ┌──────────────┐
     │   AST /    │  │Sentence  │  │   Structural │
     │  Regex     │  │Embeddings│  │   Metadata   │
     │ Extraction │  │(MiniLM)  │  │   Only       │
     └─────┬──────┘  └────┬─────┘  └──────┬───────┘
           └──────────────┼───────────────┘
                          │
                          ▼
            ┌─────────────────────────────┐
            │   AGENT 1: Code Analysis    │
            │   Detects duplicate pairs   │
            │   Cosine similarity > 0.78  │
            └──────────────┬──────────────┘
                           │
                           ▼
            ┌─────────────────────────────┐
            │   AGENT 2: Abstraction      │
            │   Designs shared library    │
            │   API and module structure  │
            └──────────────┬──────────────┘
                           │
                           ▼
            ┌─────────────────────────────┐
            │   AGENT 3: Impact           │
            │   Assessment                │
            │   ROI, hours, migration     │
            │   cost with audit formula   │
            └──────────────┬──────────────┘
                           │
                           ▼
            ┌─────────────────────────────┐
            │   AGENT 4: Migration        │
            │   Phased rollout plan,      │
            │   rollback strategy, CI/CD  │
            └──────────────┬──────────────┘
                           │
                           ▼
                       OUTPUT JSON
              (analysis + library design +
               financial impact + plan)
```

---

## Agent Breakdown

### Agent 1 — Code Analysis Agent
`agents/code_analysis_agent.py`

Detects semantically similar functions across repositories without sending actual code to any LLM.

**Detection pipeline:**
1. Language detection (Python, JavaScript, TypeScript, Java, Go, Ruby, Generic) via AST and regex heuristics
2. Function extraction — AST-based for Python, regex-based for all others
3. Semantic embedding using `all-MiniLM-L6-v2` from Sentence Transformers
4. Cosine similarity scoring between all cross-repo function pairs
5. Severity classification: `high` (>0.92), `medium` (>0.85), `low` (>0.78)
6. Structural summary — not source code — is sent to the LLM for pattern labeling

**Privacy guarantee:** Function names are SHA-256 hashed before reaching the LLM. String literals and comments are stripped. The LLM receives only structural metadata counts and similarity scores.

---

### Agent 2 — Abstraction Agent
`agents/abstraction_agent.py`

Takes the analysis output and designs a concrete shared library API. Returns a structured JSON schema including:
- Package name and version
- Module hierarchy
- Interface signatures with type annotations
- Which repos each interface replaces
- Estimated lines-of-code reduction

---

### Agent 3 — Impact Assessment Agent
`agents/impact_assessment_agent.py`

Calculates auditable financial and operational metrics using a transparent cost model:

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Engineer blended rate | $75/hr | Blended India/US mixed team |
| Review time per duplicate | 15 min | Time to understand, check, decide per function per PR |
| Review cycles per month | 2 | Typical shared utility PR cadence |
| Migration hours per file | 1.0 hr | Read, replace, test, PR |

**Formula:**

```
monthly_review_hours = pairs × (15 min / 60) × 2 cycles
annual_usd_saved     = monthly_review_hours × 12 × $75
migration_hours      = pairs × 1.0 hr
```

All numbers and the formula used are returned in the response payload for full auditability. The LLM is explicitly instructed not to recalculate — it receives exact values and is asked to interpret them in business terms.

---

### Agent 4 — Migration Agent
`agents/migration_agent.py`

Produces a phased migration plan with:
- Named phases with day estimates and task lists
- Per-phase success criteria and rollback steps
- Full testing checklist
- Team composition requirements (engineers, reviewers, hours)
- CI/CD changes required
- A ready-to-use PR description template
- Communication plan for cross-team announcements

---

## Privacy Layer (MCP)

`mcp/privacy_layer.py` and `mcp/mcp_server.py`

Every codebase passes through the privacy layer before any LLM interaction occurs. The layer:

- Replaces all function names with deterministic SHA-256 hashes (`fn_3a9f1c2b`)
- Replaces all class names with hashed identifiers (`cls_7d4e2f1a`)
- Strips all string literals (which may contain secrets, passwords, or business logic)
- Removes all comments
- Falls back to regex-based anonymization if AST parsing fails

The MCP server exposes this as a standalone REST microservice (`POST /mcp/anonymize`) that can be deployed independently of the main application.

---

## Supported Languages

| Language | Extraction Method | Notes |
|----------|-------------------|-------|
| Python | AST (full) + regex fallback | Type annotations, docstrings, return detection |
| JavaScript | Regex | `function`, arrow functions, async patterns |
| TypeScript | Regex | Class methods, access modifiers |
| Java | Regex | Method signatures with access modifiers |
| Go | Regex | `func` declarations, receiver methods |
| Ruby | Regex | `def` blocks, predicate methods |
| Generic | Regex | `function`, `def`, `func` pattern fallback |

---

## Project Structure

```
gicode/
├── agents/
│   ├── base_agent.py              # Groq API client, unified call_llm()
│   ├── code_analysis_agent.py     # Agent 1 — duplicate detection
│   ├── abstraction_agent.py       # Agent 2 — shared library design
│   ├── impact_assessment_agent.py # Agent 3 — ROI and cost modeling
│   └── migration_agent.py         # Agent 4 — migration plan generation
│
├── mcp/
│   ├── privacy_layer.py           # AST/regex code anonymizer
│   └── mcp_server.py              # FastAPI MCP privacy microservice
│
├── orchestrator/
│   ├── orchestrator.py            # Pipeline runner, agent sequencer
│   └── json_utils.py              # LLM JSON fence parser and fallback
│
├── integrations/
│   └── github_connector.py        # GitHub API: fetch repo code by owner/repo
│
├── dashboard/
│   └── app.py                     # FastAPI server, /api/analyze and /api/analyze-github
│
├── tests/
├── pipeline_output.json           # Sample output from demo run
├── .env.example
└── Dockerfile
```

---

## API Reference

The dashboard exposes three endpoints.

### POST `/api/analyze`

Analyze raw source code strings directly.

**Request:**
```json
{
  "repos": {
    "auth-service": "def validate_email(email):\n    ...",
    "payment-service": "def check_email(addr):\n    ..."
  }
}
```

**Response shape:**
```json
{
  "analysis": {
    "summary": "...",
    "top_patterns": [...],
    "risk_level": "high",
    "raw_pairs": [...],
    "languages_detected": {...}
  },
  "abstraction": {
    "library_name": "...",
    "modules": [...],
    "estimated_loc_reduction": 320
  },
  "impact": {
    "executive_summary": "...",
    "financial_impact": {
      "annual_savings_usd": 10800,
      "migration_days_one_time": 2
    },
    "computed_savings": {
      "formula_used": "..."
    }
  },
  "migration": {
    "phases": [...],
    "testing_checklist": [...],
    "rollback_strategy": "..."
  },
  "pipeline_duration_seconds": 12.4,
  "repos_analyzed": ["auth-service", "payment-service"]
}
```

---

### POST `/api/analyze-github`

Pull live code from GitHub and run the full pipeline.

**Request:**
```json
{
  "repos": ["owner/repo-a", "owner/repo-b"],
  "token": "ghp_...",
  "file_pattern": "*.py"
}
```

Fetches up to 20 `.py` files per repo (excluding test, migration, and vendor paths), concatenates them, and passes to the pipeline. Returns the full pipeline result plus a `fetch_log` per repo showing files found and fetched.

---

### GET `/api/health`

```json
{ "status": "ok", "service": "Code Dedup Resolver" }
```

---

## Setup

**Prerequisites:** Python 3.10+, a free [Groq API key](https://console.groq.com), and optionally a GitHub personal access token for private repos.

```bash
# Clone
git clone https://github.com/your-org/gicode.git
cd gicode

# Install dependencies
pip install -r dashboard/requirements.txt

# Configure
cp .env.example .env
# Add GROQ_API_KEY and optionally GITHUB_TOKEN to .env

# Run the API server
cd dashboard
uvicorn app:main --reload --port 8000

# Or run the pipeline directly (demo mode)
cd orchestrator
python orchestrator.py
```

**Docker:**
```bash
docker build -t gicode .
docker run -p 8000:8000 --env-file .env gicode
```

---

## Running the Demo

The orchestrator includes a self-contained demo with two repos — `auth-service` and `payment-service` — each containing four functions with obvious semantic duplication. Running it directly exercises the full pipeline and writes output to `pipeline_output.json`.

```bash
cd orchestrator
python orchestrator.py
```

Expected output shape covers 4 detected duplicate pairs, a proposed shared utility library, ~$10,800 in projected annual savings, and a 2-day migration estimate.

---

## LLM Configuration

All agents share a single `call_llm()` function in `base_agent.py`. The model is configurable:

| Model | Use case |
|-------|----------|
| `llama-3.3-70b-versatile` | Default — best quality, free tier |
| `mixtral-8x7b-32768` | Good for code-heavy prompts |
| `llama3-8b-8192` | Fastest, lowest latency |

Change `GROQ_MODEL` in `base_agent.py` to switch models. Temperature is fixed at 0.2 across all agents for deterministic, structured JSON output.

---

## Design Decisions

**Why embedding similarity instead of LLM comparison?**
Sending actual source code to an LLM for comparison is a privacy and cost risk. Sentence embeddings over anonymized function signatures are fast, free, and produce consistent similarity scores without exposing implementation details.

**Why a separate privacy layer?**
The MCP privacy layer is a hard architectural boundary. No agent can bypass it. The anonymization happens before the orchestrator calls any agent, making it auditable and testable independently.

**Why transparent cost formulas?**
The impact assessment agent explicitly returns the formula it used and is instructed not to recalculate. This prevents LLM hallucination of financial figures and makes the output defensible to engineering leadership.

**Why JSON-only agent responses?**
All agents use `temperature=0.2` and strict JSON system prompts. The `json_utils.parse_llm_json()` utility strips markdown code fences and falls back to regex extraction, making the pipeline resilient to LLM formatting drift without sacrificing structure.

---

## Requirements

```
fastapi
uvicorn
pydantic
sentence-transformers
groq
python-dotenv
requests
```

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

Built for engineering teams that take technical debt seriously.

</div>