from gevent import monkey

monkey.patch_all()
from flask_socketio import SocketIO, emit, join_room, leave_room, disconnect
from flask import request
from flask_login import current_user
import os
from .socket_helpers import (
    handle_chat_helper,
    handle_edit_message_helper,
    handle_delete_message_helper,
    handle_add_reaction_helper,
    handle_delete_reaction_helper,
    handle_delete_attachment_helper,
    get_relevant_sids,
    construct_response,
    parse_error_from_message,
)
from functools import wraps
from app.cache_layer import cache


SUCCESS = "success"
GENERIC_ERROR = "error"
GENERIC_SOCKET_ERROR = "socket_error"

if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "https://cameron-smack.onrender.com",
        "http://cameron-smack.onrender.com",
        "https://www.smack.fyi",
        "https://smack.fyi",
        "http://www.smack.fyi",
        "http://smack.fyi",
    ]
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins=origins)


# Flask-SocketIO does not allow the use of the login_required decorator,
# but... we can define a custom decorator to disconnect non-authenticated users
def authenticated_only(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        if not current_user.is_authenticated:
            disconnect()
        else:
            return f(*args, **kwargs)

    return wrapped


############################ MESSAGES ############################


@socketio.on("chat")
def handle_chat(data):
    room = str(data.get("channel_id"))
    new_message = handle_chat_helper(data)

    if "error" in new_message:
        error_status, error_message = parse_error_from_message(new_message)
        return construct_response(error_status, error_message)

    try:
        emit("chat", new_message, room=room, include_self=False)
        return construct_response(SUCCESS, new_message)
    except Exception:
        return construct_response(
            GENERIC_SOCKET_ERROR, "There was a problem with the socket communication."
        )


# TODO: more proper error handling for the remaining routes
@socketio.on("edit")
def handle_edit(data):
    room = str(data.get("channel_id"))
    edited_message = handle_edit_message_helper(data)
    emit("edit", edited_message, room=room, include_self=False)
    return construct_response(SUCCESS, edited_message)


@socketio.on("delete")
def handle_delete(data):
    room = str(data.get("channel_id"))
    message_id = str(data.get("message_id"))
    handle_delete_message_helper(data)
    emit("delete", message_id, room=room, include_self=False)
    return construct_response(SUCCESS, message_id)


############################ REACTIONS ############################


@socketio.on("addReaction")
def handle_add_reaction(data):
    room = str(data.get("channel_id"))
    res = handle_add_reaction_helper(data)

    if "error" in res:
        return construct_response("invalid_request", res.get("error"))

    emit("addReaction", res, room=room, include_self=False)
    return construct_response(SUCCESS, res, override_key="payload")


@socketio.on("deleteReaction")
def handle_delete_reaction(data):
    room = str(data.get("channel_id"))
    res = handle_delete_reaction_helper(data)

    if "error" in res:
        return construct_response("invalid_request", res.get("error"))

    emit("deleteReaction", res, room=room, include_self=False)
    return construct_response(SUCCESS, res, override_key="payload")


############################ ATTACHMENTS ############################


@socketio.on("deleteAttachment")
def handle_delete_attachment(data):
    room = str(data.get("channel_id"))
    res = handle_delete_attachment_helper(data)
    emit("deleteAttachment", res, room=room, include_self=False)
    return construct_response(SUCCESS, res, override_key="payload")


############################ CONNECTION EVENTS ############################


@socketio.on("connect")
@authenticated_only
def handle_connect(data):
    sid = request.sid
    client_id = str(current_user.id)
    user_hash_key = f"user:{client_id}"
    print(f"Client {client_id} connected with sid {sid}")
    cache.set(user_hash_key, {sid: "online"})
    start_appearing_online = cache.user_active_sessions_quantity(user_hash_key) == 1

    if start_appearing_online:
        cache.set("online-users", {client_id: "active"})
        online_users = cache.get("online-users", type_=dict)

        # Notify relevant users that `user` just logged in
        rooms = get_relevant_sids(current_user, online_users)

        for room in rooms:
            emit(
                "user_online",
                {"id": client_id, "status": "active"},
                room=room,
                include_self=False,
            )
    else:
        online_users = cache.get("online-users", type_=dict)

    # Send list of connected users to current client
    # TODO: should maybe only include the intersection of online & relevant users
    emit("after_connecting", online_users, room=sid)


@socketio.on("disconnect")
@authenticated_only
def handle_disconnect():
    sid = request.sid
    client_id = str(current_user.id)
    user_hash_key = f"user:{client_id}"
    print(f"Client {client_id} disconnected with sid {sid}")
    cache.delete(user_hash_key, field=sid)
    is_fully_disconnected = cache.user_active_sessions_quantity(user_hash_key) == 0

    if is_fully_disconnected:
        cache.delete(user_hash_key)
        cache.delete("online-users", field=client_id)
        online_users = cache.get("online-users", type_=dict)

        # Notify relevant users
        rooms = get_relevant_sids(current_user, online_users)

        for room in rooms:
            emit("user_offline", client_id, room=room)


@socketio.on("join")
def on_join(data):
    room = data["channel_id"]
    user_id = data["user_id"]
    join_room(room)
    print(f"Client {user_id} joined room {room}")


@socketio.on("leave")
def on_leave(data):
    room = data["channel_id"]
    user_id = data["user_id"]
    leave_room(room)
    print(f"Client {user_id} left room {room}")
    room_hash_key = f"room:{room}"

    # Indicate that the user has stopped typing
    cache.delete(room_hash_key, field=user_id)
    typing_users = cache.get(room_hash_key, type_=dict)
    emit("stopped_typing", typing_users, room=room, include_self=False)


############################ NOTIFICATION EVENTS ############################


@socketio.on("new_DM_convo")
def handle_new_dm(data):
    emit("new_DM_convo", data, broadcast=True)


############################ TYPING EVENTS ############################


@socketio.on("type")
def handle_typing_event(data):
    try:
        room = data["channel_id"]
        user_id = data["user_id"]
    except KeyError:
        return
    name = f"{data['first_name']} {data['last_name']}"
    room_hash_key = f"room:{room}"

    # Add the user to the room's typing hash
    cache.set(room_hash_key, {user_id: name})

    # Retrieve all users currently typing in the room
    typing_users = cache.get(room_hash_key, type_=dict)

    emit("type", typing_users, room=room, include_self=False)
    return typing_users


@socketio.on("stopped_typing")
def handle_stop_typing_event(data):
    try:
        room = data["channel_id"]
        user_id = data["user_id"]
    except KeyError:
        return
    room_hash_key = f"room:{room}"

    # Remove the user from the room's typing hash
    cache.delete(room_hash_key, field=user_id)

    # Retrieve the remaining users currently typing in the room
    typing_users = cache.get(room_hash_key, type_=dict)

    emit("stopped_typing", typing_users, room=room, include_self=False)
    return typing_users
