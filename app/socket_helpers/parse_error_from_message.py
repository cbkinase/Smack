def parse_error_from_message(message):
    """Extract error details from a message dictionary."""
    error_status = message.get("error")
    error_message = message.get("error_message")
    return error_status, error_message
