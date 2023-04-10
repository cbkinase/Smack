from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Message
from app.forms import MessageForm
from datetime import datetime

message_routes = Blueprint('messages', __name__)

def message_to_dict(message):
    return {
        "id": message.id,
        "user_id": message.user_id,
        "channel_id": "Coming soon",
        "content": message.content,
        "is_pinned": message.is_pinned,
        "updated_at": message.updated_at
    }, 200

def message_not_found():
    return {
            "message": "Message could not be found",
            "status_code": 404
        }, 404

def forbidden():
    return {
            "message": "Forbidden",
            "status_code": 403
        }, 403

@message_routes.route('/<message_id>', methods=["PUT"])
@login_required
def edit_message(message_id):
    req = request.get_json()
    message = db.session.query(Message).get(message_id)
    this_user = current_user.to_dict()
    current_timestamp = datetime.utcnow()
    # print(message)
    # print(message.user_id)
    # print(current_user.to_dict())
    
    if not message:
        return message_not_found()

    if this_user['id'] != message.user_id:
        return forbidden()
        
    # form = MessageForm()
    # form['csrf_token'].data = request.cookies['csrf_token']
    new_content = req["content"]
    new_pinned = req["is_pinned"]
    
    if new_content:
        message.content = new_content
    if new_pinned:
        message.is_pinned = new_pinned
    
    message.updated_at = current_timestamp
    db.session.commit()

    return message_to_dict(message)

@message_routes.route('/<message_id>', methods=["DELETE"])
@login_required
def delete_message(message_id):
    message = db.session.query(Message).get(message_id)
    this_user = current_user.to_dict()

    if not message:
        return message_not_found()
    
    if this_user['id'] != message.user_id:
        return forbidden()
    
    db.session.delete(message)
    db.session.commit()

    return {
        "message": "Successfully deleted",
        "status_code": 200
    }, 200