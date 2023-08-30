from app.models import db, Reaction


def handle_delete_reaction_helper(data):
    reaction_id = data.get("id")
    reaction = Reaction.query.get(reaction_id)

    if not reaction:
        return { "error": "Reaction not found" }

    try:
        db.session.delete(reaction)
        db.session.commit()
    except Exception as e:
        return { "error": f"Failed to delete reaction: {e}" }

    return data
