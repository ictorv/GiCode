import sys
sys.path.insert(0, '../agents')
sys.path.insert(0, '../mcp')
sys.path.insert(0, '../orchestrator')

from privacy_layer import PrivacyLayer


def test_privacy_layer_hashes_names():
    p = PrivacyLayer()
    code = 'def secret_business_logic(key):\n    return key + "proprietary"'
    result = p.anonymize(code)
    assert "secret_business_logic" not in result
    assert "fn_" in result
    assert "proprietary" not in result


def test_privacy_layer_strips_strings():
    p = PrivacyLayer()
    code = 'x = "top_secret_api_key_12345"'
    result = p.anonymize(code)
    assert "top_secret_api_key_12345" not in result


def test_extract_structure():
    p = PrivacyLayer()
    code = '''
def foo(a, b, c):
    return a + b + c

class Bar:
    def method(self):
        pass
'''
    structure = p.extract_structure(code)
    assert len(structure["functions"]) >= 1
    assert len(structure["classes"]) >= 1


def test_similarity_detection():
    import code_analysis_agent
    repo_a = '''
def validate_email(email):
    import re
    return bool(re.match(r"[^@]+@[^@]+", email))
'''
    repo_b = '''
def check_email_format(email_str):
    import re
    return re.match(r"[^@]+@[^@]+", email_str) is not None
'''
    pairs = code_analysis_agent.find_similar_pairs({"repo-a": repo_a, "repo-b": repo_b})
    assert isinstance(pairs, list)


if __name__ == "__main__":
    test_privacy_layer_hashes_names()
    test_privacy_layer_strips_strings()
    test_extract_structure()
    test_similarity_detection()
    print("All tests passed!")