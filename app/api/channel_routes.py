from flask import Blueprint, request
from app.models import Channel, User, db, Message, channel_user
from flask_login import login_required, current_user
from ..websocket import socketio
from .errors import not_found, forbidden, bad_request, internal_server_error
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.sql import exists, func
from sqlalchemy import and_, not_
from app.cache_layer import cache
from app.cache_layer.DataTypes import DataType

channel_routes = Blueprint("channels", __name__)


@channel_routes.route("/user-short")
@login_required
def user_short_channels():
    """
    List of channels displayed on a logged in users left sidebar
    """
    LIMIT = 20
    short_user_public = (
        Channel.query.join(Channel.users)
        .filter(User.id == current_user.id, Channel.is_direct == False)  # noqa: E712
        .order_by(Channel.updated_at.desc())
        .limit(LIMIT)
        .all()
    )

    short_user_dms = (
        Channel.query.join(Channel.users)
        .filter(User.id == current_user.id, Channel.is_direct == True)  # noqa: E712
        .order_by(Channel.updated_at.desc())
        .limit(LIMIT)
        .all()
    )

    return {
        "user_channels": [
            channel.to_short_dict()
            if not channel.is_direct
            else channel.to_dict_n_members(6)
            for channel in [*short_user_public, *short_user_dms]
        ]
    }


@channel_routes.route("/all-public")
@login_required
@cache.register(timeout=30, return_type=DataType.JSON, include_request=True)
def all_public_channels():
    page = request.args.get("page", type=int)
    per_page = request.args.get("per_page", type=int)

    if page and per_page:
        try:
            next_channels = Channel.query.filter(
                Channel.is_direct == False  # noqa: E712
            ).paginate(page=page, per_page=per_page)
            return {
                "all_channels": [
                    channel.to_dict_n_members(50) for channel in next_channels.items
                ],
                "total_pages": next_channels.pages,
                "total_items": next_channels.total,
            }
        except Exception:
            return {"error": "No more records"}, 418

    raise NotImplementedError


@channel_routes.route("/user-direct")
@login_required
def all_user_dms():
    page = request.args.get("page", type=int)
    per_page = request.args.get("per_page", type=int)

    if page and per_page:
        try:
            next_channels = Channel.query.filter(
                Channel.is_direct == True,  # noqa: E712
                exists().where(
                    and_(
                        channel_user.c.users_id == current_user.id,
                        channel_user.c.channels_id == Channel.id,
                    )
                ),
            ).paginate(page=page, per_page=per_page)
            return {
                "all_channels": [
                    channel.to_dict_n_members(10) for channel in next_channels.items
                ],
                "total_pages": next_channels.pages,
                "total_items": next_channels.total,
            }
        except Exception:
            return {"error": "No more records"}, 418

    raise NotImplementedError


def find_dm_between(current_user_id, other_user_id):
    if current_user_id == other_user_id:
        target_users = [current_user_id]
    else:
        target_users = [current_user_id, other_user_id]

    member_count_target = len(target_users)

    # Subquery to filter only channels that contain desired user(s) and no more
    user_filter_subquery = (
        db.session.query(channel_user.c.channels_id)
        .filter(channel_user.c.users_id.in_(target_users))
        .group_by(channel_user.c.channels_id)
        .having(func.count(channel_user.c.users_id) == member_count_target)
        .subquery()
    )

    # Main query
    channels_query = Channel.query.filter(
        and_(
            Channel.id == user_filter_subquery.c.channels_id,
            Channel.is_direct == True,  # noqa: E712
            not_(
                exists().where(
                    and_(
                        channel_user.c.channels_id == Channel.id,
                        channel_user.c.users_id.notin_(target_users),
                    )
                )
            ),
        )
    )

    return channels_query.first()


@channel_routes.route("/find-dm-channel")
@login_required
def get_dm_channel():
    current_user_id = current_user.id
    other_user_id = request.args.get("other_user_id", type=int)

    if not current_user_id or not other_user_id:
        return bad_request("Missing user IDs")

    channel = find_dm_between(current_user_id, other_user_id)

    if channel:
        return channel.to_dict()
    else:
        return not_found("Channel not found")


@channel_routes.route("/<channel_id>")
@login_required
def one_channel(channel_id):
    """
    Get the details of a single channel by ID
    """
    channel = Channel.get_channel(channel_id)

    if not channel:
        return not_found("Channel not found")

    return {"single_channel": channel.to_dict()}


@channel_routes.route("/", methods=["POST"])
@login_required
def create_channel():
    """
    Create a new channel
    """
    try:
        new_channel = Channel.from_request(current_user, request)
        return new_channel.to_dict(), 201

    except Exception:
        return bad_request("Please fill out all fields")


@channel_routes.route("/<channel_id>", methods=["DELETE"])
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
    try:
        db.session.delete(channel)
        db.session.commit()
    except SQLAlchemyError:
        return
    return {"message": "Channel successfully deleted."}


@channel_routes.route("/<channel_id>", methods=["PUT"])
@login_required
def edit_channel(channel_id):
    """
    Edit a channel by ID
    """
    channel = Channel.get_channel(channel_id)

    if not channel:
        return not_found("Channel not found")

    if current_user.id != channel.owner_id:
        return forbidden("User must own the channel")

    try:
        channel.edit_from_json(request)
        return channel.to_dict()
    except Exception:
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
        current_user.join_channel(channel)
    except Exception:
        return internal_server_error()

    try:
        # TODO: emit this only to the SIDs of relevant users + relevant room
        socketio.emit("new_DM_convo", channel_id)
    except Exception as e:
        print(e)
        # TODO: handle this better, should also be more specific about exceptions

    return {"message": "Successfully added user to the channel"}


@channel_routes.route("/<int:channel_id>/users/<int:user_id>", methods=["POST"])
@login_required
def add_nonself_channel_member(channel_id, user_id):
    """
    Have an authenticated user add another user of `user_id` to a channel of `channel_id`
    """
    channel = Channel.get_channel(channel_id)
    other_user = User.query.get(user_id)

    if not channel or not other_user:
        return not_found()

    if current_user not in channel.users:
        return forbidden("Must be a channel member to add new members")

    try:
        other_user.join_channel(channel)
    except Exception:
        return internal_server_error()

    try:
        # TODO: emit this only to the SIDs of relevant users + relevant room
        socketio.emit("new_DM_convo", channel_id)
    except Exception as e:
        print(e)
        # TODO: handle this better, should also be more specific about exceptions

    return {"message": "Successfully added user to the channel"}


@channel_routes.route("/<int:channel_id>/members")
@login_required
def get_all_channel_members(channel_id):
    """
    Returns all users who are members of the given channel
    """
    channel = Channel.get_channel(channel_id)

    if not channel:
        return not_found("Channel not found")

    return {"Users": [user.to_safe_dict() for user in channel.users]}


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

    if current_user.id != user_id and current_user.id != channel.owner_id:
        return forbidden("Must either own the channel or be removing self")

    try:
        channel.remove_user(user_to_delete)
        return {"message": "Successfully deleted user from the channel"}
    except Exception:
        return internal_server_error()


### Message-related Routes


@channel_routes.route("/<int:channel_id>/messages")
@login_required
def get_all_messages_for_channel(channel_id):
    """
    Get the messages for a particular channel
    """
    channel = Channel.get_channel(channel_id)

    if not channel:
        return not_found("Channel not found")

    if current_user not in channel.users:
        return forbidden()

    page = request.args.get("page", type=int)
    per_page = request.args.get("per_page", type=int)
    channel_messages_query = Message.get_everything_for_channel_query(channel_id)

    if page and per_page:
        try:
            channel_messages = channel_messages_query.paginate(
                page=page, per_page=per_page
            ).items
        except Exception:
            return {"error": "No more records"}, 418

    return [msg.to_dict() for msg in channel_messages]
