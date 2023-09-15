from flask import Blueprint, request
from app.models import Channel, User, db, Message
from flask_login import login_required, current_user
from ..socket import socketio
from sqlalchemy.orm import joinedload
from .errors import not_found, forbidden, bad_request

channel_routes = Blueprint('channels', __name__)


@channel_routes.route('/all')
@login_required
def all_channels():
    """
    Get all channels
    """
    all_channels = Channel.query.options(joinedload(Channel.users)).all()
    return { "all_channels": [channel.to_dict() for channel in all_channels] }


@channel_routes.route('/user')
@login_required
def user_channels():
    """
    Get all channels the currently logged in user is part of
    """
    user = User.query.options(
        joinedload(User.channels).joinedload(Channel.users),
    ).filter(User.id == current_user.id).first()
    return { "user_channels": [channel.to_dict() for channel in user.channels] }


@channel_routes.route('/<channel_id>')
@login_required
def one_channel(channel_id):
    """
    Get the details of a single channel by ID
    """
    channel = Channel.query\
          .options(joinedload(Channel.users))\
          .filter(Channel.id == channel_id)\
          .first()

    if not channel:
        return not_found("Channel not found")

    return {"single_channel": [channel.to_dict()]}


@channel_routes.route('/', methods=['POST'])
@login_required
def create_channel():
    """
    Create a new channel
    """
    try:
        new_channel = Channel.from_request(current_user, request)
        db.session.add(new_channel)
        new_channel.users.append(current_user)
        db.session.commit()
        return new_channel.to_dict(), 201

    except:
        return bad_request("Please fill out all fields")


@channel_routes.route('/<channel_id>', methods=['DELETE'])
@login_required
def delete_channel(channel_id):
    """
    Delete a channel by ID
    """
    channel = Channel.query.get(channel_id)

    if not channel:
        return not_found("Channel not found")

    if channel.owner_id != current_user.id:
        return forbidden("User must own the channel")

    db.session.delete(channel)
    db.session.commit()
    return {"message": "Channel successfully deleted."}


@channel_routes.route('/<channel_id>', methods=['PUT'])
@login_required
def edit_channel(channel_id):
    """
    Edit a channel by ID
    """
    channel = Channel.query\
          .options(joinedload(Channel.users))\
          .filter(Channel.id == channel_id)\
          .first()

    if not channel:
        return not_found("Channel not found")

    if current_user.id != channel.owner_id:
        return forbidden("User must own the channel")

    try:
        channel.name = request.json.get('name')
        channel.subject = request.json.get('subject')
        channel.is_private = request.json.get('is_private')
        channel.is_direct = request.json.get('is_direct')
        channel.updated_at = db.func.now()
        db.session.commit()
        return channel.to_dict()
    except:
        return bad_request("Please fill out all fields")


### Members-related Routes


@channel_routes.route("/<int:channel_id>/users", methods=["POST"])
@login_required
def add_channel_member(channel_id):
    """
    When an authenticated user hits this route, they
    will be added to the channel with the given ID
    """
    channel = Channel.query.get(channel_id)

    if not channel:
        return not_found("Channel not found")

    try:
        current_user.channels.append(channel)
        db.session.commit()
        try:
            # TODO: emit this only to the SIDs of relevant users + relevant room
            socketio.emit("new_DM_convo", channel_id)
        except Exception as e:
            print(e)
        return {"message": "Successfully added user to the channel"}
    except:
        return not_found("Something went wrong")  # should probably be a different code


@channel_routes.route("/<int:channel_id>/users/<int:user_id>", methods=["POST"])
@login_required
def add_nonself_channel_member(channel_id, user_id):
    """
    Have an authenticated user add another user of `user_id` to a channel of `channel_id`
    """
    channel = Channel.query\
          .options(joinedload(Channel.users))\
          .filter(Channel.id == channel_id)\
          .first()
    other_user = User.query.get(user_id)

    if not channel or not other_user:
        return not_found()

    if current_user not in channel.users:
        return forbidden("Must be a channel member to add new members")

    try:
        other_user.channels.append(channel)
        db.session.commit()
        try:
            # TODO: emit this only to the SIDs of relevant users + relevant room
            socketio.emit("new_DM_convo", channel_id)
        except Exception as e:
            print(e)
        return {"message": "Successfully added user to the channel"}
    except:
        return not_found("Something went wrong...")  # different status code/message in future


@channel_routes.route("/<int:channel_id>/members")
@login_required
def get_all_channel_members(channel_id):
    """
    Returns all users who are members of the given channel
    """
    channel = Channel.query\
          .options(joinedload(Channel.users))\
          .filter(Channel.id == channel_id)\
          .first()

    if not channel:
        return not_found("Channel not found")

    return {"Users": [user.to_dict() for user in channel.users]}


@channel_routes.route("/<int:channel_id>/members/<int:user_id>", methods=["DELETE"])
@login_required
def delete_channel_member(channel_id, user_id):
    """
    Remove a given user of `user_id` from a channel `channel_id`
    """
    channel = Channel.query.get(channel_id)
    user_to_delete = User.query.get(user_id)

    if not channel or not user_to_delete:
        return not_found()

    if current_user.id != user_id:
        if current_user.id != channel.owner_id:
            return forbidden("Must either own the channel or be removing self")

    try:
        channel.users.remove(user_to_delete)
        db.session.commit()
        return {"message": "Successfully deleted user from the channel"}
    except:
        return not_found("Something went wrong...")  # ...


### Message-related Routes


@channel_routes.route("/<int:channel_id>/messages")
@login_required
def get_all_messages_for_channel(channel_id):
    """
    Get the messages for a particular channel
    """
    channel = Channel.query\
          .options(joinedload(Channel.users))\
          .filter(Channel.id == channel_id)\
          .first()

    if current_user not in channel.users:
        return forbidden()

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
