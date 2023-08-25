from gevent import monkey
monkey.patch_all()
from flask_socketio import SocketIO, emit, join_room, leave_room
import os
from .socket_helpers import (
    handle_chat_helper,
    handle_edit_message_helper,
    handle_delete_message_helper,
    handle_add_reaction_helper,
    handle_delete_reaction_helper,
    handle_delete_attachment_helper
    )
from redis import Redis

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


@socketio.on("chat")
def handle_chat(data):
    room = str(data.get('channel_id'))
    new_message = handle_chat_helper(data)

    if new_message.get("error"):
        return {'status': new_message.error, 'message': new_message.error_message}

    try:
        emit("chat", new_message, to=room, include_self=False)
        return {'status': 'success', 'message': new_message}
    except Exception as e:
        print(e)
        return {'status': 'socket_error', 'message': 'Something went wrong with sockets.'}


# TODO: proper error handling for the remaining routes
@socketio.on("edit")
def handle_edit(data):
    room = str(data.get('channel_id'))
    edited_message = handle_edit_message_helper(data)
    emit("edit", edited_message, to=room, include_self=False)
    return {'status': 'success', 'message': edited_message}


@socketio.on("delete")
def handle_delete(data):
    room = str(data.get('channel_id'))
    message_id = str(data.get('message_id'))
    handle_delete_message_helper(data)
    emit("delete", message_id, to=room, include_self=False)
    return {'status': 'success', 'message': message_id}


@socketio.on("addReaction")
def handle_add_reaction(data):
    room = str(data.get('channel_id'))
    res = handle_add_reaction_helper(data)

    if res.get('errors'):
        return {'status': 'invalid_request', 'message': res.errors}

    emit("addReaction", res, to=room, include_self=False)
    return {'status': 'success', 'payload': res}


@socketio.on("deleteReaction")
def handle_delete_reaction(data):
    room = str(data.get('channel_id'))
    res = handle_delete_reaction_helper(data)
    emit("deleteReaction", res, to=room, include_self=False)
    return {'status': 'success', 'payload': res}


@socketio.on("deleteAttachment")
def handle_delete_attachment(data):
    room = str(data.get('channel_id'))
    res = handle_delete_attachment_helper(data)
    emit("deleteAttachment", res, to=room, include_self=False)
    return {'status': 'success', 'payload': res}


@socketio.on('connect')
def handle_connect():
    print(f'Client connected')


@socketio.on('disconnect')
def handle_disconnect():
    print(f'Client disconnected')


@socketio.on('join')
def on_join(data):
    room = data['channel_id']
    join_room(room)
    print(f"Client joined room {room}")


@socketio.on('leave')
def on_leave(data):
    room = data['channel_id']
    leave_room(room)
    print(f"Client left room {room}")


@socketio.on("new_DM_convo")
def handle_new_dm(data):
    emit("new_DM_convo", data, broadcast=True)


@socketio.on("type")
def handle_typing_event(data):
    room = data['channel_id']
    user_id = data['user_id']
    name = f"{data['first_name']} {data['last_name']}"
    # Add the user to the room's typing hash in Redis
    redis.hset(f"room:{room}", user_id, name)
     # Retrieve all users currently typing in the room
    typing_users = redis.hgetall(f"room:{room}")
    emit("type", typing_users, to=room, include_self=False)
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
