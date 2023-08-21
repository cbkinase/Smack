from app.models import db, Message
from ..s3_helpers import remove_file_from_s3

def handle_delete_message_helper(data):
    message_id = data.get('message_id')
    message = db.session.query(Message).get(message_id)

    message_attachments = message.attachments
    for attachment in message_attachments:

        remove_attachment = remove_file_from_s3(attachment.content)
        if not remove_attachment:
            return {'errors': ['Failed to delete files from AWS']}, 400

    db.session.delete(message)
    db.session.commit()
    return {"message": "Successfully deleted"}
