from flask import Blueprint, request
from app.models import Channel, User, db, Message
from flask_login import login_required, current_user
from ..socket import socketio
from sqlalchemy.orm import joinedload

channel_routes = Blueprint('channels', __name__)


@channel_routes.route('/all')
@login_required
def all_channels():
    all_channels = Channel.query.options(joinedload(Channel.users)).all()
    return { "all_channels": [channel.to_dict() for channel in all_channels] }, 200

# GET all the channels that the user is in
@channel_routes.route('/user')
@login_required
def user_channels():
    user = User.query.options(
        joinedload(User.channels).joinedload(Channel.users),
    ).filter(User.id == current_user.id).first()
    return { "user_channels": [channel.to_dict() for channel in user.channels] }, 200

# GET single channel
@channel_routes.route('/<channel_id>')
@login_required
def one_channel(channel_id):
    channel = Channel.query\
          .options(joinedload(Channel.users))\
          .filter(Channel.id == channel_id)\
          .first()

    if not channel:
        return {"errors": "Channel not found."}, 404

    return {"single_channel": [channel.to_dict()]}, 200



@channel_routes.route('/', methods=['POST'])
@login_required
def create_channel():
    try:
        new_channel = Channel(
            name = request.json.get('name'),
            subject = request.json.get('subject'),
            is_private = request.json.get('is_private'),
            is_direct = request.json.get('is_direct'),
            owner = current_user
        )
        db.session.add(new_channel)
        new_channel.users.append(current_user)
        db.session.commit()
        return new_channel.to_dict(), 201

    except:
        error_obj = {
            "message": "Validation Error",
            "errors": "Please fill out all the fields."
        }
        return error_obj, 400

@channel_routes.route('/<channel_id>', methods=['DELETE'])
@login_required
def delete_channel(channel_id):
    channel = Channel.query.get(channel_id)
    if not channel:
        return {"errors": "Channel not found."}, 404

    if channel.owner_id != current_user.id:
        return {"errors": "User does not own this channel"}, 403


    db.session.delete(channel)
    db.session.commit()
    return {"message": "Channel successfully deleted."}, 200

@channel_routes.route('/<channel_id>', methods=['PUT'])
@login_required
def edit_channel(channel_id):
    channel = Channel.query\
          .options(joinedload(Channel.users))\
          .filter(Channel.id == channel_id)\
          .first()

    if not channel:
        return {"errors": "Channel not found."}, 404

    if current_user.id != channel.owner_id:
        return {"errors": "Must own channel."}, 403

    try:
        channel.name = request.json.get('name')
        channel.subject = request.json.get('subject')
        channel.is_private = request.json.get('is_private')
        channel.is_direct = request.json.get('is_direct')
        channel.updated_at = db.func.now()
        db.session.commit()
        return channel.to_dict()
    except:
        error_obj = {
            "message": "Validation Error",
            "errors": "Please fill out all the fields."
        }
        return error_obj, 400


### Members-related Routes
@channel_routes.route("/<int:channel_id>/users", methods=["POST"])
@login_required
def add_channel_member(channel_id):
    channel = Channel.query.get(channel_id)

    if not channel or not current_user:
        return {"message": "Resource not found"}, 404

    try:
        current_user.channels.append(channel)
        db.session.commit()
        try:
            socketio.emit("new_DM_convo", channel_id)
        except Exception as e:
            print(e)
        return {"message": "Successfully added user to the channel"}
    except:
        return {"message": "Something went wrong..."}, 404

@channel_routes.route("/<int:channel_id>/users/<int:user_id>", methods=["POST"])
@login_required
def add_nonself_channel_member(channel_id, user_id):
    channel = Channel.query\
          .options(joinedload(Channel.users))\
          .filter(Channel.id == channel_id)\
          .first()
    other_user = User.query.get(user_id)

    if not channel or not current_user or not other_user:
        return {"message": "Resource not found"}, 404

    if current_user not in channel.users:
        return {"message": "Forbidden: must be member of Channel"}, 403


    try:
        other_user.channels.append(channel)
        db.session.commit()
        try:
            socketio.emit("new_DM_convo", channel_id)
        except Exception as e:
            print(e)
            # pass
        return {"message": "Successfully added user to the channel"}
    except:
        return {"message": "Something went wrong..."}, 404


# get all members of channel
@channel_routes.route("/<int:channel_id>/members")
@login_required
def get_all_channel_members(channel_id):
    channel = Channel.query\
          .options(joinedload(Channel.users))\
          .filter(Channel.id == channel_id)\
          .first()

    if not channel:
        return {"message": "Resource not found"}, 404

    return {"Users": [user.to_dict() for user in channel.users]}


@channel_routes.route("/<int:channel_id>/members/<int:user_id>", methods=["DELETE"])
@login_required
def delete_channel_member(channel_id, user_id):
    channel = Channel.query.get(channel_id)
    user_to_delete = User.query.get(user_id)

    if not channel or not user_to_delete:
        return {"message": "Resource not found"}, 404

    if current_user.id != user_id:
        if current_user.id != channel.owner_id:
            return {"message": "Must either own the channel or be removing self"}, 403

    try:
        channel.users.remove(user_to_delete)
        db.session.commit()
        return {"message": "Successfully deleted user from the channel"}
    except:
        return {"message": "Something went wrong..."}, 404



### Message-related Routes

@channel_routes.route("/<int:channel_id>/messages")
@login_required
def get_all_messages_for_channel(channel_id):
    channel = Channel.query\
          .options(joinedload(Channel.users))\
          .filter(Channel.id == channel_id)\
          .first()

    if current_user not in channel.users:
        return {"error": "Forbidden"}, 403

    page = request.args.get('page', type=int)
    per_page = request.args.get('per_page', type=int)

    channel_messages = Message.query.options(
        joinedload(Message.reactions),
        joinedload(Message.attachments),
        joinedload(Message.users),
        ).filter(Message.channel_id == channel_id)\
        .order_by(Message.id.desc())

    if page and per_page:
            try:
                channel_messages = channel_messages.paginate(page=page, per_page=per_page).items
            except:
                return { "errors": "No more records" }, 418

    return [msg.to_dict() for msg in channel_messages]
