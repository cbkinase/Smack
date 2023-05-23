from flask_socketio import SocketIO, emit, join_room
import os

if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "https://smack.onrender.com/",
        "http://smack.onrender.com/"
    ]
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins="*")

@socketio.on("chat")
def handle_chat(data):
    emit("chat", data, broadcast=True)


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
    print('Client connected')



@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')


@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['channel_id']
    join_room(room)
    emit("welcome", f"{username}", room=room)


@socketio.on("new_DM_convo")
def handle_new_dm(data):
    emit("new_DM_convo", data, broadcast=True)
