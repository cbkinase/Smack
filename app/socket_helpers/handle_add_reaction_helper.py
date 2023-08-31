from app.models import db, Message, Reaction
from flask_login import current_user


def handle_add_reaction_helper(data):
    message_id = data.get('message_id')
    rxn = data.get('reaction')
    try:
        message = db.session.query(Message).get(message_id)

        existing_reaction = db.session.query(Reaction).filter(
            Reaction.message_id == message_id,
            Reaction.user_id == current_user.id,
            Reaction.reaction == rxn
        ).first()

        if existing_reaction:
            return {"error": "User already has reacted with this reaction"}

        new_reaction = Reaction(user=current_user, messages=message, reaction=rxn)
        db.session.add(new_reaction)
        db.session.commit()
        return new_reaction.to_dict()
    except:
        return { "error": "Failed to post reaction" }
