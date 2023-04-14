from flask_socketio import SocketIO, emit
import os

if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "https://smack.onrender.com/",
        "http://smack.onrender.com/"
    ]
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins=origins)

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