from app.models import db, Reaction


def handle_delete_reaction_helper(data):
    reaction_id = data.get("id")
    reaction = Reaction.query.get(reaction_id)

    if not reaction:
        return { "error": "Reaction not found" }

    db.session.delete(reaction)
    db.session.commit()
    return data
