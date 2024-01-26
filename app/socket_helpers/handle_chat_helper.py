from app.models import db, Message, Attachment
from flask_login import current_user
from .write_error_message import write_error_message, GENERIC_WRITE_FAILURE
from sqlalchemy.exc import SQLAlchemyError


def handle_chat_helper(data):
    channel_id = int(data["channel_id"])
    msg_content = data["msg"]
    attachments = data.get("attachments", {})
    new_message = Message(
        content=msg_content, users=current_user, channel_id=channel_id
    )

    try:
        db.session.add(new_message)
        for id, url in attachments.items():
            new_attachment = Attachment(
                user=current_user, message=new_message, content=url
            )
            db.session.add(new_attachment)
        db.session.commit()

    except SQLAlchemyError:
        return write_error_message(
            GENERIC_WRITE_FAILURE, "Failed to handle chat request in the database"
        )
    return new_message.to_dict_socket()
