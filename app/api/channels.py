from flask import Blueprint, request, jsonify
from app.models import channel_user, Channel, User, db, Message
from flask_login import login_required, current_user

channel_routes = Blueprint('channels', __name__)

def user_id_generator():
    return int(str(current_user).split('<User ')[1].split('>')[0])

@channel_routes.route('/all')
@login_required
def all_channels():
    user_id = user_id_generator()
    allchannels = Channel.query.all()
    curr_user = User.query.get(user_id)
    resp_obj = {"all_channels": []}
    for channel in allchannels:
        if channel in curr_user.channel or not channel.is_private:
            resp_obj["all_channels"].append(channel.to_dict())
    return resp_obj, 200

@channel_routes.route('/user')
@login_required
def user_channels():
    user_ids = user_id_generator()

    user = User.query.get(user_ids)
    channels_id = [channel.id for channel in user.channel]

    resp_obj = {"user_channels": [], "members": []}
    for channel in channels_id:
        channel_info = Channel.query.get(channel)
        resp_obj["user_channels"].append(channel_info.to_dict())
        resp_obj["members"].append([user.to_dict() for user in channel_info.users])
    return resp_obj, 200

@channel_routes.route('/<channel_id>')
@login_required
def one_channel(channel_id):
    user_id = user_id_generator()
    channel_exist = Channel.query.get(channel_id)
    if not channel_exist:
        error_obj = {"message": "Channel with the specified id could not be found."}
        return error_obj, 404
    this_user = User.query.get(user_id)
    print('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', this_user.channel)
    #if channel_id not in [channel.id for channel in this_user.channel]:
        #error_obj = {"message": "Current user does not belong to the specified channel."}
        #return error_obj, 403
    one_channel = Channel.query.get(channel_id)
    return {"single_channel": one_channel.to_dict()}


@channel_routes.route('/', methods=['POST'])
@login_required
def create_channel():
    user_id = user_id_generator()
    this_user = User.query.get(user_id)
    try:
        new_channel = Channel(
            name = request.json.get('name'),
            subject = request.json.get('subject'),
            is_private = request.json.get('is_private'),
            is_direct = request.json.get('is_direct'),
            owner = this_user
        )
        db.session.add(new_channel)
        new_channel.user.append(this_user)
        db.session.commit()
        return new_channel.to_dict()
    except:
        error_obj = {
            "message": "Validation Error",
            "errors": "Please fill out all the fields."
        }
        return error_obj, 400

@channel_routes.route('/<channel_id>', methods=['DELETE'])
@login_required
def delete_channel(channel_id):
    user_id = user_id_generator()
    channel_exist = Channel.query.get(channel_id)
    if not channel_exist:
        error_obj = {"message": "Channel with the specified id could not be found."}
        return error_obj, 404
    this_user = User.query.get(user_id)
    if channel_id not in [channel.id for channel in this_user.channel]:
        error_obj = {"message": "Current user does not belong to the specified channel."}
        return error_obj, 403
    deleted_channel = Channel.query.get(channel_id)
    db.session.delete(deleted_channel)
    db.session.commit()
    resp_obj = {"message": "Channel successfully deleted."}
    return resp_obj, 200

@channel_routes.route('/<channel_id>', methods=['PUT'])
@login_required
def edit_channel(channel_id):
    user_id = user_id_generator()
    channel_exist = Channel.query.get(channel_id)
    if not channel_exist:
        error_obj = {"message": "Channel with the specified id could not be found."}
        return error_obj, 404
    this_user = User.query.get(user_id)
    if channel_id not in [channel.id for channel in this_user.channel]:
        error_obj = {"message": "Current user does not belong to the specified channel."}
        return error_obj, 403
    try:
        edited_channel = Channel.query.get(channel_id)
        edited_channel.name = request.json.get('name')
        edited_channel.subject = request.json.get('subject')
        edited_channel.is_private = request.json.get('is_private')
        edited_channel.is_direct = request.json.get('is_direct')
        edited_channel.updated_at = db.func.now()
        db.session.commit()
        return edited_channel.to_dict()
    except:
        error_obj = {
            "message": "Validation Error",
            "errors": "Please fill out all the fields."
        }
        return error_obj, 400


### Members-related Routes

@channel_routes.route("/<int:channel_id>/users", methods=["POST"])
@login_required
def add_channel_member(channel_id):
    channel = Channel.query.get(channel_id)
    user = User.query.get(user_id_generator())

    if not channel or not user:
        return {"message": "Resource not found"}, 404

    try:
        user.channel.append(channel)
        db.session.commit()
        return {"message": "Successfully added user to the channel"}
    except:
        return {"message": "Something went wrong..."}, 404

@channel_routes.route("/<int:channel_id>/users")
@login_required
def get_all_channel_members(channel_id):
    channel = Channel.query.get(channel_id)

    if not channel:
        return {"message": "Resource not found"}, 404

    return {"Users": [user.to_dict() for user in channel.users]}


@channel_routes.route("/<int:channel_id>/users/<int:user_id>", methods=["DELETE"])
@login_required
def delete_channel_member(channel_id, user_id):
    # Need to check to make sure the deleter is the channel owner
    print("hi")
    channel = Channel.query.get(channel_id)
    user_to_delete = User.query.get(user_id)

    if not channel or not user_to_delete:
        return {"message": "Resource not found"}, 404
    try:
        channel.users.remove(user_to_delete)
        db.session.commit()
        return {"message": "Successfully deleted user from the channel"}
    except:
        return {"message": "Something went wrong..."}, 404



### Message-related Routes

@channel_routes.route("/<int:channel_id>/messages")
@login_required
def get_all_messages_for_channel(channel_id):
    # We should check to ensure the conversation is accessible to the user making the request
    # I.e. -- the channel is not private, or the user is a member of that private channel
    channel_messages = Message.query.filter(Message.channel_id.is_(
        channel_id)).all()
    channel_messages_data = []

    for msg in channel_messages:
        msg_data = msg.to_dict()
        msg_data['User'] = {
            'username': msg.users.username,
            'avatar': msg.users.avatar
        }
        channel_messages_data.append(msg_data)

    return jsonify(channel_messages_data)


@channel_routes.route("<int:channel_id>", methods=["POST"])
@login_required
def make_post_for_channel(channel_id):
    # We should check to ensure the conversation is accessible to the user making the request
    # I.e. -- the channel is not private, or the user is a member of that private channel

    # need to get form

    try:
        new_message = Message(**request.get_json())
        db.session.add(new_message)
        db.session.commit()
        return new_message.to_dict()
    except:
        # This message will depend on what we check on the form. Probably message length.
        return { "message": "Failed to create message" }, 400

# if channel_id not in [channel.id for channel in User.query.get(user_id).channel]:
#     # return error
