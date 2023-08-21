from app.models import db, Message
from datetime import datetime


def handle_edit_message_helper(data):
    new_content = data["content"]
    new_pinned = data["is_pinned"]
    message_id = data["message_id"]
    message = db.session.query(Message).get(message_id)
    current_timestamp = datetime.utcnow()

    if new_content:
        message.content = new_content
    if new_pinned:
        message.is_pinned = new_pinned

    message.updated_at = current_timestamp
    db.session.commit()

    return message.to_dict_socket()
