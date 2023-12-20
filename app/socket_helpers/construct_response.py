def construct_response(status: str, message: str, override_key: str = None):
    key = override_key or "message"
    return {"status": status, key: message}
