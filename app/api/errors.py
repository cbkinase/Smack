from flask import jsonify
from typing import Optional
from functools import partial


def validation_errors_to_error_messages(validation_errors):
    """
    Turns WTForms validation errors into a list
    """
    error_messages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            error_messages.append(f"{field} : {error}")
    return error_messages


def create_error_response(
    status_code: int, error_type: str, error_message: Optional[str] = None
):
    """
    Create a standardized error response with a given status code, error type, and default message.
    """
    default_message_mapping = {
        400: "Bad data provided",
        403: "You are not allowed to do that",
        404: "The requested resource was not found at this location",
        500: "Internal Server Error",
    }

    message = error_message or default_message_mapping.get(
        status_code, "An error occurred"
    )
    response = jsonify({"error": error_type, "message": message})
    response.status_code = status_code
    return response


bad_request = partial(create_error_response, 400, "Bad Request")
forbidden = partial(create_error_response, 403, "Forbidden")
not_found = partial(create_error_response, 404, "Not Found")
internal_server_error = partial(create_error_response, 500, "Internal Server Error")
