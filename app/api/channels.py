from flask import Blueprint, request, jsonify
from app.models import Channel_user, Channel, User, db, Message
from flask_login import login_required, current_user

channel_routes = Blueprint('channels', __name__)

def user_id_generator():
    return int(str(current_user).split('<User ')[1].split('>')[0])

@channel_routes.route('/')
@login_required
def user_channels():
    user_id = user_id_generator()
    joined_channels = Channel_user.query.filter(Channel_user.user_id == user_id).all()
    channels_id = [channels.channel_id for channels in joined_channels]
    resp_obj = {"all_channels": []}
    for channel in channels_id:
        channel_info = Channel.query.get(channel)
        resp_obj["all_channels"].append(channel_info.to_dict())
    return resp_obj, 200

@channel_routes.route('/<channel_id>')
@login_required
def one_channel(channel_id):
    user_id = user_id_generator()
    channel_exist = Channel.query.get(channel_id)
    if not channel_exist:
        error_obj = {"message": "Channel with the specified id could not be found."}
        return error_obj, 404
    member_check = Channel_user.query.filter(Channel_user.user_id == user_id, Channel_user.channel_id == channel_id).all()
    if not member_check:
        error_obj = {"message": "Current user does not belong to the specified channel."}
        return error_obj, 403
    one_channel = Channel.query.get(channel_id)
    return one_channel.to_dict()


@channel_routes.route('/', methods=['POST'])
@login_required
def create_channel():
    user_id = user_id_generator()
    try:
        new_channel = Channel(
            name = request.json.get('name'),
            subject = request.json.get('subject'),
            is_private = request.json.get('is_private'),
            is_direct = request.json.get('is_direct')
        )
        db.session.add(new_channel)
        db.session.commit()
        new_cu = Channel_user(
            user_id = user_id,
            channel_id = new_channel.id,
            role = 'Test'
        )
        db.session.add(new_cu)
        db.session.commit()
        return new_channel.to_dict()
    except:
        error_obj = {
            "message": "Validation Error",
            "errors": "Please fill out all the fields."
        }
        return error_obj, 400

@channel_routes.route('/<channel_id>', methods=['DELETE'])
@login_required
def delete_channel(channel_id):
    user_id = user_id_generator()
    channel_exist = Channel.query.get(channel_id)
    if not channel_exist:
        error_obj = {"message": "Channel with the specified id could not be found."}
        return error_obj, 404
    member_check = Channel_user.query.filter(Channel_user.user_id == user_id, Channel_user.channel_id == channel_id).all()
    if not member_check:
        error_obj = {"message": "Current user does not belong to the specified channel."}
        return error_obj, 403
    deleted_channel = Channel.query.get(channel_id)
    db.session.delete(deleted_channel)
    for o in member_check:
        db.session.delete(o)
    db.session.commit()
    resp_obj = {"message": "Channel successfully deleted."}
    return resp_obj, 200
