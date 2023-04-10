from flask import Blueprint, jsonify, request
from app.models import messages, reaction, channel, db
from flask_login import login_required

user_routes = Blueprint('messages', __name__)


@user_routes.route("/<int:message_id>/reactions")
@login_required
def create_reaction_for_message(message_id):
    # We should check to ensure the conversation is accessible to the user making the request
    # I.e. -- the channel is not private, or the user is a member of that private channel

    # will have to get form
    # form["csrf_token"].data = request.cookies["csrf_token"]
    try:
        new_reaction = reaction.Reaction(**request.get_json())
        db.session.add(new_reaction)
        db.session.commit()
        return new_reaction.to_dict()
    except:
        return { "message": "Failed to delete reaction" }, 400


########### THESE ARE ACTUALLY CHANNEL ROUTES, WRITING THEM HERE TEMPORARILY TO PREVENT MERGE CONFLICTS ###########

@channel_routes.route("/<int:channel_id>")
@login_required
def get_all_messages_for_channel(channel_id):
    # We should check to ensure the conversation is accessible to the user making the request
    # I.e. -- the channel is not private, or the user is a member of that private channel
    channel_messages = messages.Message.query.filter(messages.Message.channel_id.is_(channel_id))
    return jsonify([msg.to_dict() for msg in channel_messages])


@channel_routes.route("<int:channel_id>", methods=["POST"])
@login_required
def make_post_for_channel(channel_id):
    # We should check to ensure the conversation is accessible to the user making the request
    # I.e. -- the channel is not private, or the user is a member of that private channel

    # need to get form

    try:
        new_message = messages.Message(**request.get_json())
        db.session.add(new_message)
        db.session.commit()
        return new_message.to_dict()
    except:
        # This message will depend on what we check on the form. Probably message length.
        return { "message": "Failed to create message" }, 400
