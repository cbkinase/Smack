from app.models import db, Message, Attachment
from flask_login import current_user


def handle_chat_helper(data):
    channel_id = int(data["channel_id"])
    msg_content = data["msg"]
    attachments = data.get('attachments')

    try:
        new_message = Message(content=msg_content, users=current_user, channel_id=channel_id)
        db.session.add(new_message)
    except Exception as e:
        print(e)
        return {
            "error": "db_write_error",
            "error_message": "Failed to write message to database"
        }

    if attachments:
        for id, url in attachments.items():
            try:
                new_attachment = Attachment(user=current_user, message=new_message, content=url)
                db.session.add(new_attachment)
            except Exception as e:
                return {
                    "error": "db_write_error",
                    "error_message": "Failed to write attachment to database"
                }

    try:
        db.session.commit()
    except Exception as e:
        print(e)
        return {
            "error": "db_write_error",
            "error_message": "Failed to commit part of the chat request to the database"
        }

    return new_message.to_dict_socket()
