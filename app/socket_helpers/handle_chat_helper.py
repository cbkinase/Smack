from app.models import db, Message, Channel, User, Attachment
from flask_login import current_user


def handle_chat_helper(data):
    channel_id = int(data["channel_id"])
    msg_content = data["msg"]
    attachments = data.get('attachments')

    try:
        this_channel = Channel.query.get(channel_id)
        this_user = User.query.get(current_user.id)
    except Exception as e:
        print(e)
        return {
            "error": "db_write_error",
            "error_message": "Failed to get either the channel or the user"
        }

    try:
        new_message = Message(content=msg_content, users=this_user, channels=this_channel)
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
                new_attachment = Attachment(user=this_user, message=new_message, content=url)
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
