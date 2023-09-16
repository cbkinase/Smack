from app.models import db, Message, Reaction
from flask_login import current_user
from .write_error_message import write_error_message
from sqlalchemy.exc import SQLAlchemyError


def handle_add_reaction_helper(data):
    message_id = data.get('message_id')
    rxn = data.get('reaction')

    if not message_id or not rxn:
        return write_error_message("Incomplete data")

    try:
        existing_reaction = Reaction.find_existing_reaction(message_id, current_user, rxn)

        if existing_reaction:
            return write_error_message("User already has reacted with this reaction")

        message = Message.query.get(message_id)

        if not message:
            return write_error_message("Not found", "Message not found")

        new_reaction = Reaction(user=current_user, message=message, reaction=rxn)
        db.session.add(new_reaction)
        db.session.commit()
        return new_reaction.to_dict()

    except SQLAlchemyError:
        return write_error_message("Failed to post reaction")
