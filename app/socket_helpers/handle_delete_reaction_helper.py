from app.models import db, Reaction


def handle_delete_reaction_helper(data):
    reaction_id = data.get("id")
    reaction = db.session.query(Reaction).get(reaction_id)

    db.session.delete(reaction)
    db.session.commit()
    return data
