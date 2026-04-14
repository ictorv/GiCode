# ─────────────────────────────────────────────────────────────────────────────
#  Stage 1 — Builder
#  Install dependencies in a separate layer so they're cached independently
#  from source-code changes.
# ─────────────────────────────────────────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /build

# System packages needed only to compile wheels
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ curl && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir --prefix=/install -r requirements.txt

# Pre-download the sentence-transformer model so the container is self-contained
# (no outbound network needed at runtime)
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"


# ─────────────────────────────────────────────────────────────────────────────
#  Stage 2 — Runtime
# ─────────────────────────────────────────────────────────────────────────────
FROM python:3.11-slim AS runtime

LABEL org.opencontainers.image.title="Code Dedup Resolver" \
      org.opencontainers.image.description="Multi-agent code duplication analysis service" \
      org.opencontainers.image.source="https://github.com/your-org/code-dedup-resolver"

# Copy installed packages from builder
COPY --from=builder /install /usr/local
# Copy cached model weights
COPY --from=builder /root/.cache /root/.cache

WORKDIR /app

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy application source
COPY src/ ./src/

# Fix ownership
RUN chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check — used by Docker and docker-compose
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD curl -f http://localhost:8000/healthz || exit 1

# Production entrypoint
CMD ["uvicorn", "src.app:app", \
     "--host", "0.0.0.0", \
     "--port", "8000", \
     "--workers", "2", \
     "--log-config", "/dev/null"]