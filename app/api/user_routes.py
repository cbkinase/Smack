from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import User
from app.forms import EditUserForm
from .errors import (
    bad_request,
    forbidden,
    not_found,
    validation_errors_to_error_messages,
)

user_routes = Blueprint("users", __name__)


@user_routes.route("/")
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {"users": [user.to_dict() for user in users]}


@user_routes.route("/<int:id>")
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)

    if user:
        return user.to_dict()

    return not_found("User not found")


@user_routes.route("/<int:id>", methods=["PUT"])
@login_required
def user_edit(id):
    """
    Query for a user by id, edit that users information, and return that user in a dictionary
    """
    user = User.query.get(id)

    if not user:
        return not_found("User not found")

    if current_user.id != id:
        return forbidden()

    form = EditUserForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        user.edit_from_form(form)
        return user.to_dict()

    return bad_request(validation_errors_to_error_messages(form.errors))
