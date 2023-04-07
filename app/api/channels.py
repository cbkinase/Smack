from flask import Blueprint, request
from app.models import channel_user, Channel, User, db
from flask_login import login_required

channel_routes = Blueprint('channels', __name__)

def user_id_check(user_id):
    user = User.query.get(user_id)
    if not user:
        error_obj = {"message": "User with the specified id could not be found."}
        return error_obj, 404

def in_channel(user_id, channel_id):
    member_check = channel_user.query.filter(channel_user.user_id == user_id, channel_user.channel_id == channel_id)
    if not member_check:
        error_obj = {"message": "Current user does not belong to the specified channel."}
        return error_obj, 403

def channel_check(channel_id):
    channel_exist = Channel.query.get(channel_id)
    if not channel_exist:
        error_obj = {"message": "Channel with the specified id could not be found."}
        return error_obj, 404

@channel_routes.route('/<current_user_id>')
@login_required
def user_channels(current_user_id):
    user_id_check(current_user_id)
    joined_channels = channel_user.query.filter(channel_user.channel_id == current_user_id).all()
    channels_id = [channels.channel_id for channels in joined_channels]
    resp_obj = {"all_channels": []}
    for channel in channels_id:
        channel_info = Channel.query.get(channel)
        resp_obj.all_channels.push(channel_info.to_dict())
    return resp_obj, 200

@channel_routes.route('/<current_user_id>/<channel_id>')
@login_required
def one_channel(current_user_id, channel_id):
    user_id_check(current_user_id)
    in_channel(current_user_id, channel_id)
    one_channel = Channel.query.get(channel)
    return one_channel.to_dict()


@channel_routes.route('/', methods=['POST'])
@login_required
def create_channel():
    try:
        new_channel = Channel(
            name = request.json('name'),
            subject = request.json('subject'),
            is_private = request.json('is_private'),
            is_direct = request.json('is_direct')
        )
        db.session.add(new_channel)
        db.session.commit()
        return new_channel.to_dict()
    except:
        error_obj = {
            "message": "Validation Error",
            "errors": "Please fill out all the fields."
        }
        return error_obj, 400

@channel_routes.routes('/<channel_id>', methods=['DELETE'])
@login_required
def delete_channel(channel_id):
    channel_check(channel_id)
    deleted_channel = Channel.query.get(channel_id)
    db.session.delete(deleted_channel)
    db.session.commit()
    resp_obj = {"message": "Channel successfully deleted."}
    return resp_obj, 200

@channel_routes.routes('/<channel_id>', methods=['PUT'])
@login_required
    channel_check(channel_id)
    try:
        edited_channel = Channel.query.get(channel_id)
        edited_channel.name = request.json('name')
        edited_channel.subject = request.json('subject')
        edited_channel.is_private = request.json('is_private')
        edited_channel.is_direct = request.json('is_direct')
        edited_channel.updated_at = db.func.now()
        db.session.commit()
        return edited_channel.to_dict()
    except:
        error_obj = {
            "message": "Validation Error",
            "errors": "Please fill out all the fields."
        }
        return error_obj, 400