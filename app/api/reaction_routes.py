from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Reaction

reaction_routes = Blueprint('reactions', __name__)

def reaction_not_found():
    return {
            "message": "Reaction could not be found",
            "status_code": 404
        }, 404

def forbidden():
    return {
            "message": "Forbidden",
            "status_code": 403
        }, 403

@reaction_routes.route('/<reaction_id>', methods=["DELETE"])
@login_required
def delete_reaction(reaction_id):
    reaction = db.session.query(Reaction).get(reaction_id)
    this_user = current_user.to_dict()

    if not reaction:
        return reaction_not_found()
    
    if this_user['id'] != reaction.user_id:
        return forbidden()
    
    db.session.delete(reaction)
    db.session.commit()

    return {
        "message": "Successfully deleted",
        "status_code": 200
    }, 200