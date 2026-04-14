import sys
import json
import time

sys.path.insert(0, '../agents')
sys.path.insert(0, '../mcp')

import code_analysis_agent
import abstraction_agent
import impact_assessment_agent
import migration_agent


def run_pipeline(repo_codes: dict, verbose: bool = True) -> dict:
    """
    Full agentic pipeline:
    1. Code Analysis Agent  → detects duplicates (privacy-preserving)
    2. Abstraction Agent    → designs shared library API
    3. Impact Assessment    → quantifies savings and risks
    4. Migration Agent      → creates implementation plan
    """
    results = {}
    start = time.time()

    def log(msg):
        if verbose:
            print(f"[{time.time()-start:.1f}s] {msg}")

    log("Starting pipeline...")
    log(f"Repos to analyze: {list(repo_codes.keys())}")

    # Agent 1
    log("[1/4] Code Analysis Agent running...")
    results["analysis"] = code_analysis_agent.run(repo_codes)
    log(f"      Found {len(results['analysis'].get('raw_pairs', []))} duplicate pairs")

    # Agent 2
    log("[2/4] Abstraction Agent running...")
    results["abstraction"] = abstraction_agent.run(results["analysis"])
    log(f"      Library proposed: {results['abstraction'].get('library_name', 'unknown')}")

    # Agent 3
    log("[3/4] Impact Assessment Agent running...")
    results["impact"] = impact_assessment_agent.run(results["analysis"], results["abstraction"])
    savings = results["impact"].get("computed_savings", {})
    log(f"      Annual savings: ~${savings.get('annual_usd_saved', 0):,}")

    # Agent 4
    log("[4/4] Migration Agent running...")
    results["migration"] = migration_agent.run(
        results["analysis"], results["abstraction"], results["impact"]
    )
    log(f"      Migration plan: {results['migration'].get('total_estimated_days', '?')} days")

    results["pipeline_duration_seconds"] = round(time.time() - start, 1)
    results["repos_analyzed"] = list(repo_codes.keys())

    log(f"Pipeline complete in {results['pipeline_duration_seconds']}s")
    return results


if __name__ == "__main__":
    # ---- DEMO: two repos with obvious duplication ----
    REPO_A = '''
def validate_email(email):
    """Check if email is valid format"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def hash_password(password, salt="default_salt"):
    """Hash a password with SHA256"""
    import hashlib
    return hashlib.sha256((password + salt).encode()).hexdigest()

def paginate_list(items, page=1, page_size=20):
    """Return a page of items"""
    start = (page - 1) * page_size
    return items[start:start + page_size]

def retry_request(func, max_retries=3, delay=1.0):
    """Retry a function call on failure"""
    import time
    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            time.sleep(delay * (attempt + 1))
'''

    REPO_B = '''
def is_valid_email(email_address):
    """Validate email address format"""
    import re
    regex = r"[^@]+@[^@]+\\.[^@]+"
    return re.match(regex, email_address) is not None

def encrypt_password(pwd, salt_key="secret"):
    """Encrypt password using SHA256"""
    import hashlib
    combined = pwd + salt_key
    return hashlib.sha256(combined.encode()).hexdigest()

def get_page(data_list, current_page, items_per_page=20):
    """Get paginated slice of list"""
    offset = (current_page - 1) * items_per_page
    return data_list[offset:offset + items_per_page]

def with_retry(callable_func, retries=3, wait=1):
    """Call a function with automatic retry"""
    import time
    for i in range(retries):
        try:
            return callable_func()
        except Exception:
            if i == retries - 1:
                raise
            time.sleep(wait)
'''

    result = run_pipeline({"repo-auth-service": REPO_A, "repo-payment-service": REPO_B})
    print("\n" + "="*60)
    print("FINAL RESULTS")
    print("="*60)
    print(json.dumps(result, indent=2))

    # Save output
    with open("pipeline_output.json", "w") as f:
        json.dump(result, f, indent=2)
    print("\nSaved to pipeline_output.json")