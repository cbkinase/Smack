from flask_socketio import SocketIO, emit, join_room, leave_room
import os
from .socket_helpers import handle_chat_helper


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
    # Create the message (and attachments, if present)
    new_message = handle_chat_helper(data)
    if new_message.get("error"):
        return {'status': new_message.error, 'message': new_message.error_message}
    # Relay the message to relevant clients
    try:
        emit("chat", new_message, to=room, include_self=False)
        return {'status': 'success', 'message': new_message}
    except Exception as e:
        print(e)
        return {'status': 'socket_error', 'message': 'Something went wrong with sockets.'}


@socketio.on("delete")
def handle_delete(data):
    emit("delete", data, broadcast=True)


@socketio.on("edit")
def handle_delete(data):
    emit("delete", data, broadcast=True)


@socketio.on("addReaction")
def handle_add_reaction(data):
    emit("addReaction", data, broadcast=True)


@socketio.on("deleteReaction")
def handle_delete_reaction(data):
    emit("deleteReaction", data, broadcast=True)


@socketio.on("deleteAttachment")
def handle_delete_attachment(data):
    emit("deleteAttachment", data, broadcast=True)


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


@socketio.on('join_multiple_rooms')
def on_join_multiple_rooms(data):
    # Allow us to listen for events in all relevant rooms
    user_rooms = data['rooms']
    for room in user_rooms:
        join_room(room)
