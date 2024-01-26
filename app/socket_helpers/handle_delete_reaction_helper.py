from app.models import db, Reaction
from .write_error_message import write_error_message
from sqlalchemy.exc import SQLAlchemyError


def handle_delete_reaction_helper(data):
    reaction_id = data.get("id")
    reaction = Reaction.query.get(reaction_id)

    if not reaction:
        return write_error_message("Reaction not found")

    try:
        db.session.delete(reaction)
        db.session.commit()
    except SQLAlchemyError:
        return write_error_message("Failed to delete reaction")

    return data
