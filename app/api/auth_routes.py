from flask import Blueprint, request, current_app
from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
from .errors import bad_request, validation_errors_to_error_messages
from ..email import send_email

auth_routes = Blueprint('auth', __name__)


@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()

    return unauthorized()


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually so validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.find_by_email(form.data['email'])
        login_user(user)
        return user.to_dict()
    return bad_request("Invalid credentials")


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User.from_form(form)
        token = user.generate_confirmation_token()
        send_url = current_app.config['EMAIL_URL_PREFIX'] + f"/api/auth/confirm/{user.id}/{token}"
        send_email(
            to=user.email,
            subject="Confirm Your Account",
            template="confirm_email",
            user=user,
            token=token,
            send_url=send_url
        )
        # login_user(user)
        return user.to_dict()
    return bad_request(validation_errors_to_error_messages(form.errors))


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'error': 'Unauthorized'}, 401


@auth_routes.route('/confirm/<int:user_id>/<token>')
def confirm(user_id, token):
    user = User.query.get(user_id)
    if user.confirmed:
        return bad_request("Account already confirmed/activated.")

    if user.confirm(token):
        db.session.commit()
        return {"status": "success", "message": "Account activated."}
    else:
        return bad_request("Invalid or expired confirmation link.")


@auth_routes.route('/confirm')
@login_required
def resend_confirmation():
    token = current_user.generate_confirmation_token()
    send_url = current_app.config['EMAIL_URL_PREFIX'] + f"/api/auth/confirm/{current_user.id}/{token}"
    send_email(
            to=current_user.email,
            subject="Confirm Your Account",
            template="confirm_email",
            user=current_user,
            token=token,
            send_url=send_url
        )
    return {"status": "success", "message": "A new confirmation email has been sent"}
