GENERIC_WRITE_FAILURE = "db_write_failure"
GENERIC_READ_FAILURE = "db_read_failure"


def write_error_message(error, error_message=None):
    if error_message is None:
        error_message = "Something went wrong"
    return {
        "error": error,
        "error_message": error_message
    }
