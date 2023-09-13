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
    get_relevant_sids
    )
from redis import Redis
from functools import wraps

redis_host = os.environ.get("REDIS_HOST") or "redis"

if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "https://cameron-smack.onrender.com",
        "http://cameron-smack.onrender.com"
    ]
    redis = Redis.from_url(redis_host, decode_responses=True)
else:
    origins = "*"
    redis = Redis(
    host=redis_host,
    port=6379,
    decode_responses=True,
    )

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
    room = str(data.get('channel_id'))
    new_message = handle_chat_helper(data)
    error = new_message.get("error")

    if error:
        return {'status': error, 'message': new_message["error_message"]}

    try:
        emit("chat", new_message, room=room, include_self=False)
        return {'status': 'success', 'message': new_message}
    except Exception as e:
        print(e)
        return {'status': 'socket_error', 'message': 'Something went wrong with sockets.'}


# TODO: proper error handling for the remaining routes
@socketio.on("edit")
def handle_edit(data):
    room = str(data.get('channel_id'))
    edited_message = handle_edit_message_helper(data)
    emit("edit", edited_message, room=room, include_self=False)
    return {'status': 'success', 'message': edited_message}


@socketio.on("delete")
def handle_delete(data):
    room = str(data.get('channel_id'))
    message_id = str(data.get('message_id'))
    handle_delete_message_helper(data)
    emit("delete", message_id, room=room, include_self=False)
    return {'status': 'success', 'message': message_id}


############################ REACTIONS ############################


@socketio.on("addReaction")
def handle_add_reaction(data):
    room = str(data.get('channel_id'))
    res = handle_add_reaction_helper(data)
    error = res.get('error')

    if error:
        return {'status': 'invalid_request', 'message': error}

    emit("addReaction", res, room=room, include_self=False)
    return {'status': 'success', 'payload': res}


@socketio.on("deleteReaction")
def handle_delete_reaction(data):
    room = str(data.get('channel_id'))
    res = handle_delete_reaction_helper(data)
    error = res.get('error')

    if error:
        return {'status': 'invalid_request', 'message': error}

    emit("deleteReaction", res, room=room, include_self=False)
    return {'status': 'success', 'payload': res}


############################ ATTACHMENTS ############################


@socketio.on("deleteAttachment")
def handle_delete_attachment(data):
    room = str(data.get('channel_id'))
    res = handle_delete_attachment_helper(data)
    emit("deleteAttachment", res, room=room, include_self=False)
    return {'status': 'success', 'payload': res}


############################ CONNECTION EVENTS ############################


@socketio.on('connect')
@authenticated_only
def handle_connect(data):
    sid = request.sid
    client_id = str(current_user.id)
    user_hash_key = f"user:{client_id}"
    print(f'Client {client_id} connected with sid {sid}')
    redis.hset(user_hash_key, sid, "online")

    if redis.hlen(user_hash_key) == 1:
        redis.hset("online-users", client_id, "true")
        # Notify relevant users
        # TODO: optimize...
        rooms = get_relevant_sids(current_user, redis)

        for room in rooms:
            print("Emitting entry to room", room)
            emit('user_online', client_id, room=room, include_self=False)

    # Inform the user who just logged in of who is online.
    # Should probably do some filtering based on relevance
    online_users = redis.hgetall("online-users")
    emit("after_connecting", online_users, room=sid)
    print("online users", online_users)
    print(redis.hgetall(user_hash_key))


@socketio.on('disconnect')
@authenticated_only
def handle_disconnect():
    sid = request.sid
    client_id = str(current_user.id)
    user_hash_key = f"user:{client_id}"
    print(f'Client {client_id} disconnected with sid {sid}')
    redis.hdel(user_hash_key, sid)

    print(redis.hlen(user_hash_key))

    if not redis.hlen(user_hash_key):
        redis.delete(user_hash_key)
        redis.hdel("online-users", client_id)

        # Notify relevant users
        # TODO: optimize...
        rooms = get_relevant_sids(current_user, redis)

        for room in rooms:
            print("Emitting exit to room", room)
            emit('user_offline', client_id, room=room)

    print("online users", redis.hgetall("online-users"))
    print(redis.hgetall(user_hash_key))


@socketio.on('join')
def on_join(data):
    room = data['channel_id']
    user_id = data['user_id']
    join_room(room)
    print(f"Client {user_id} joined room {room}")


@socketio.on('leave')
def on_leave(data):
    room = data['channel_id']
    user_id = data['user_id']
    leave_room(room)
    print(f"Client {user_id} left room {room}")

    # Indicate that the user has stopped typing
    redis.hdel(f"room:{room}", user_id)
    typing_users = redis.hgetall(f"room:{room}")
    emit('stopped_typing', typing_users, room=room, include_self=False)


############################ NOTIFICATION EVENTS ############################


@socketio.on("new_DM_convo")
def handle_new_dm(data):
    emit("new_DM_convo", data, broadcast=True)


############################ TYPING EVENTS ############################


@socketio.on("type")
def handle_typing_event(data):
    room = data['channel_id']
    user_id = data['user_id']
    name = f"{data['first_name']} {data['last_name']}"

    # Add the user to the room's typing hash in Redis
    redis.hset(f"room:{room}", user_id, name)

     # Retrieve all users currently typing in the room
    typing_users = redis.hgetall(f"room:{room}")

    emit("type", typing_users, room=room, include_self=False)
    return typing_users


@socketio.on('stopped_typing')
def handle_stop_typing_event(data):
    room = data['channel_id']
    user_id = data['user_id']

    # Remove the user from the room's typing hash in Redis
    redis.hdel(f"room:{room}", user_id)

    # Retrieve the remaining users currently typing in the room
    typing_users = redis.hgetall(f"room:{room}")

    emit('stopped_typing', typing_users, room=room, include_self=False)
    return typing_users
