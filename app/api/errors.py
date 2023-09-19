from flask import jsonify
from typing import Optional


def validation_errors_to_error_messages(validation_errors):
    """
    Turns WTForms validation errors into a list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


def create_error_response(status_code: int, error_type: str, default_message: Optional[str] = None):
    """
    Create a standardized error response with a given status code, error type, and default message.
    """
    message_mapping = {
        400: "Bad data provided",
        403: "You are not allowed to do that",
        404: "The requested resource was not found at this location",
        500: "Internal Server Error"
    }

    message = default_message or message_mapping.get(status_code, "An error occurred")
    response = jsonify({'error': error_type, 'message': message})
    response.status_code = status_code
    return response


def bad_request(message = None):
    return create_error_response(400, 'Bad Request', message)


def forbidden(message = None):
    return create_error_response(403, 'Forbidden', message)


def not_found(message = None):
    return create_error_response(404, 'Not Found', message)


def internal_server_error(message = None):
    return create_error_response(500, 'Internal Server Error', message)
