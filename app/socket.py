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


# Should probably make these .env variables, but it's fine for now...
if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "https://cameron-smack.onrender.com",
        "http://cameron-smack.onrender.com"
    ]
else:
    origins = "*"

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
