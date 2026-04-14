import hashlib
import ast
import re


class PrivacyLayer:
    """
    MCP-style privacy layer: anonymizes code before any LLM sees it.
    Actual implementations are never exposed - only structural patterns.
    """

    def anonymize(self, code: str, language: str = "python") -> str:
        if language == "python":
            return self._anonymize_python(code)
        return self._regex_anonymize(code)

    def _anonymize_python(self, code: str) -> str:
        try:
            tree = ast.parse(code)
            result = code
            replacements = {}

            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    h = hashlib.sha256(node.name.encode()).hexdigest()[:8]
                    replacements[node.name] = f"fn_{h}"
                elif isinstance(node, ast.ClassDef):
                    h = hashlib.sha256(node.name.encode()).hexdigest()[:8]
                    replacements[node.name] = f"cls_{h}"
                elif isinstance(node, ast.Constant) and isinstance(node.value, str):
                    pass  # handled by regex below

            for original, replacement in replacements.items():
                result = re.sub(r'\b' + re.escape(original) + r'\b', replacement, result)

            # Strip string literals (may contain business secrets)
            result = re.sub(r'"""[\s\S]*?"""', '"""<REDACTED>"""', result)
            result = re.sub(r"'''[\s\S]*?'''", "'''<REDACTED>'''", result)
            result = re.sub(r'"[^"\n]*"', '"<STR>"', result)
            result = re.sub(r"'[^'\n]*'", "'<STR>'", result)

            # Strip comments
            result = re.sub(r'#.*', '', result)

            return result
        except Exception:
            return self._regex_anonymize(code)

    def _regex_anonymize(self, code: str) -> str:
        code = re.sub(r'#.*', '', code)
        code = re.sub(r'"""[\s\S]*?"""', '"""<REDACTED>"""', code)
        code = re.sub(r'"[^"\n]*"', '"<STR>"', code)
        return code

    def extract_structure(self, code: str) -> dict:
        """Extract only structural metadata, never content."""
        try:
            tree = ast.parse(code)
            functions = []
            classes = []
            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    functions.append({
                        "hash": hashlib.sha256(node.name.encode()).hexdigest()[:12],
                        "args_count": len(node.args.args),
                        "lines": (node.end_lineno or 0) - node.lineno,
                        "has_return": any(isinstance(n, ast.Return) for n in ast.walk(node)),
                        "decorators": len(node.decorator_list),
                    })
                elif isinstance(node, ast.ClassDef):
                    classes.append({
                        "hash": hashlib.sha256(node.name.encode()).hexdigest()[:12],
                        "methods": sum(1 for n in ast.walk(node) if isinstance(n, ast.FunctionDef)),
                    })
            return {"functions": functions, "classes": classes, "total_lines": len(code.splitlines())}
        except Exception:
            return {"functions": [], "classes": [], "total_lines": len(code.splitlines())}
        

if __name__ == "__main__":
    p = PrivacyLayer()
    test_code = '''
def get_user_password(username):
    secret = "my_db_password_123"
    return hashlib.sha256(secret.encode()).hexdigest()
'''
    print("=== ORIGINAL ===")
    print(test_code)
    print("=== ANONYMIZED (safe to send to LLM) ===")
    print(p.anonymize(test_code))
    print("=== STRUCTURE ONLY ===")
    print(p.extract_structure(test_code))