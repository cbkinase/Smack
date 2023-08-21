from app.models import db, Message, Reaction
from flask_login import current_user


def handle_add_reaction_helper(data):
    message_id = data.get('message_id')
    rxn = data.get('reaction')
    try:
        message = db.session.query(Message).get(message_id)

        curr_reactions = db.session.query(Reaction).filter(Reaction.message_id == message_id).all()
        for reaction in curr_reactions:
            if reaction.user_id == current_user.id and reaction.reaction == rxn:
                return {"error": "user already has reacted with this reaction"}

        new_reaction = Reaction(user=current_user, messages=message, reaction=rxn)
        db.session.add(new_reaction)
        db.session.commit()
        return new_reaction.to_dict()
    except:
        return { "error": "Failed to post reaction" }
