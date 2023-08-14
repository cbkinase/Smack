from flask_socketio import SocketIO, emit, join_room
import os
from app.models import db, Message, Channel, User
from flask_login import current_user


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
    
    try:
        this_channel = Channel.query.get(int(data["channel_id"]))
        this_user = User.query.get(current_user.id)

        new_message = Message(content=data["msg"], users=this_user, channels=this_channel)
        db.session.add(new_message)
        db.session.commit()
        emit("chat", data, broadcast=True)
        return {'status': 'ok', 'message': new_message.to_dict_socket()}
        
    except:
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


@socketio.on('join_multiple_rooms')
def on_join_multiple_rooms(data):
    # Allow us to listen for events in all relevant rooms
    user_rooms = data['rooms']
    for room in user_rooms:
        join_room(room)
