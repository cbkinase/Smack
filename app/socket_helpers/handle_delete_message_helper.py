from app.models import db, Message
from ..s3_helpers import remove_file_from_s3
from .write_error_message import write_error_message


def handle_delete_message_helper(data):
    message_id = data.get('message_id')
    message = Message.query.get(message_id)
    message_attachments = message.attachments

    for attachment in message_attachments:

        remove_attachment = remove_file_from_s3(attachment.content)

        if not remove_attachment:
            return write_error_message("Failed to remove from S3")

    db.session.delete(message)
    db.session.commit()
    return {"message": "Successfully deleted"}
