from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, db
from app.forms import EditUserForm

user_routes = Blueprint('users', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    if user:
        return user.to_dict()
    return {'message': 'User couldn\'t be found', "statusCode": 404}, 404


@user_routes.route('/<int:id>', methods=['PUT'])
@login_required
def user_edit(id):
    """
    Query for a user by id, edit that users information, and return that user in a dictionary
    """

    user = User.query.get(id)

    if not user:
        return {'message': 'User couldn\'t be found', "statusCode": 404}, 404

    if current_user.id != id:
        return {'message': 'Forbidden', "statusCode": 403}, 403

    form = EditUserForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user.first_name = form.data['first_name']
        user.last_name = form.data['last_name']
        user.avatar = form.data['avatar']
        user.bio = form.data['bio']
        db.session.add(user)
        db.session.commit()
        return user.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401
