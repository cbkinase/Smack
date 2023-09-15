def construct_response(status: str, message: str, override_key: str = None):
    if override_key is None:
        return {'status': status, 'message': message}
    else:
        return {'status': status, override_key: message}
