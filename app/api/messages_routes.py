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
