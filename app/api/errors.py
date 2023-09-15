from flask import jsonify


def validation_errors_to_error_messages(validation_errors):
    """
    Turns WTForms validation errors into a list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


def bad_request(message=None):
    if message is None:
        message = "Bad data provided"
    response = jsonify({'error': 'bad request', 'message': message})
    response.status_code = 400
    return response


def forbidden(message=None):
    if message is None:
        message = "You are not allowed to do that"
    response = jsonify({'error': 'forbidden', 'message': message})
    response.status_code = 403
    return response

def not_found(message=None):
    if message is None:
        message = "The requested resource was not found at this location"
    response = jsonify({'error': "not found", 'message': message})
    response.status_code = 404
    return response
