from flask import Blueprint, request, current_app, session, redirect
import secrets
import requests
from urllib.parse import urlencode
from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
from .errors import bad_request, validation_errors_to_error_messages, not_found
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
    return bad_request("The provided credentials were invalid.")


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
        # Should do some check for whether it's a valid Origin
        base_url = request.headers.get("Origin") \
            or request.args.get('source') \
            or current_app.config['EMAIL_URL_PREFIX']

        send_url = base_url + f"/activate/{token}"
        send_email(
            to=user.email,
            subject="Confirm Your Account",
            template="confirm_email",
            user=user,
            token=token,
            send_url=send_url,
            base_url=base_url
        )
        login_user(user)
        return user.to_dict()
    return bad_request(validation_errors_to_error_messages(form.errors))


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'error': 'Unauthorized'}, 401


################ EMAIL CONFIRMATION ################


@auth_routes.route('/confirm/<int:user_id>/<token>')
def confirm(user_id, token):
    """
    Try to activate an account given a user ID and a token
    """
    user = User.query.get(user_id)
    if user.confirmed:
        return bad_request("Account already confirmed/activated.")

    if user.confirm(token):
        db.session.commit()
        return {"status": "success", "message": user.to_dict()}
    else:
        return bad_request("Invalid or expired confirmation link.")


@auth_routes.route('/confirm')
@login_required
def resend_confirmation():
    """
    Send another activation email to the logged in user
    """
    token = current_user.generate_confirmation_token()
    base_url = request.headers.get("Origin") \
        or request.args.get('source') \
        or current_app.config['EMAIL_URL_PREFIX']

    send_url = base_url + f"/activate/{token}"
    send_email(
            to=current_user.email,
            subject="Confirm Your Account",
            template="confirm_email",
            user=current_user,
            token=token,
            send_url=send_url,
            base_url=base_url
        )
    return {"status": "success", "message": "A new confirmation email has been sent"}


################ OAUTH2 ################


@auth_routes.route('/authorize/<provider>')
def oauth2_authorize(provider):
    """
    Initiate the OAuth 2.0 authorization flow with the specified provider

    Parameters:
    - provider (str): The name of the OAuth 2.0 provider (e.g., 'google').

    Request args:
    - source (str): The base URL to which the user should be redirected after the authentication process.

    Behavior:
    - Generates and stores a random state parameter in the session for CSRF protection.
    - Constructs the OAuth 2.0 authorization URL with required parameters.

    Returns:
    - A JSON object with the constructed authorization URL.
    - An error response in case of invalid provider or if the user is already logged in.

    Notes:
    - Depends on the configuration of OAUTH2_PROVIDERS set in the application config.
    - The generated `state` parameter is essential for the callback validation to prevent CSRF attacks.
    - Users should be redirected to the returned URL to proceed with the OAuth 2.0 authentication flow.

    Raises:
    - 400 Bad Request: If the user is already logged in.
    - 404 Not Found: If the specified provider is not found in the configuration.
    """

    if not current_user.is_anonymous:
        return bad_request("User already logged in")

    provider_data = current_app.config['OAUTH2_PROVIDERS'].get(provider)

    if provider_data is None:
        return not_found("Provider not found")

    base_url = request.args.get('source')

    # Generate a random string for the state parameter
    session['oauth2_state'] = secrets.token_urlsafe(16)

    # Save the origin URL
    session['base_url'] = base_url

    # Create a query string with all the OAuth2 parameters
    qs = urlencode({
        'client_id': provider_data['client_id'],
        'redirect_uri':  f"{base_url}/api/auth/callback/{provider}",
        'response_type': 'code',
        'scope': ' '.join(provider_data['scopes']),
        'state': session['oauth2_state'],
    })

    # Full OAuth2 provider authorization URL
    return {
        "status": "success",
        "message": provider_data['authorize_url'] + '?' + qs
        }


@auth_routes.route('/callback/<provider>')
def oauth2_callback(provider):
    """
    Handle the OAuth 2.0 callback from an external authentication provider

    Parameters:
    - provider (str): The name of the OAuth 2.0 provider (e.g., 'google').

    Request args:
    - code (str): The authorization code from the provider.
    - state (str): The state parameter for CSRF protection.
    - error (str, optional): Error message from the provider in case of failure.
    - Check each provider's documentation for additional info.

    Behavior:
    - Validates the state parameter against the session to prevent CSRF attacks.
    - Exchanges the authorization code for an access token.
    - Retrieves user information using the access token.
    - Finds or creates a user in the database based on the retrieved email.
    - Logs the user in.

    Returns:
    - A redirect response to the origin URL on success.
    - An error response in case of failure with relevant status codes.

    Notes:
    - Depends on the configuration of OAUTH2_PROVIDERS set in the application config.

    Raises:
    - 400 Bad Request: If state validation fails or if the error parameter is present.
    - 401 Unauthorized: If the code is absent or if token exchange fails.
    """

    # TODO: error handling UX - redirect to error page (maybe using a query parameter to set React state)
    # TODO: ensure `base_url` is within a set of trusted domains to prevent redirect vulnerabilities

    # Ensure we redirect the user to the URL they came from
    # (e.g. don't send them to cameron-smack.onrender.com when
    # they're coming from smack.fyi) -- note this is done in this way
    # because OAuth providers will only append query parameters it
    # understands, like `code`, `state`, `scope`, etc.
    base_url = session.get('base_url')
    if 'base_url' in session:
        del session['base_url']

    if not current_user.is_anonymous:
        return redirect(base_url)

    provider_data = current_app.config['OAUTH2_PROVIDERS'].get(provider)
    if provider_data is None:
        return redirect(base_url + "?error=invalid_provider")

    # Handle authentication errors
    if 'error' in request.args:
        errs = []
        for k, v in request.args.items():
            if k.startswith('error'):
                errs.append(f'{k}: {v}')
        return redirect(base_url + "?error=authentication_failure")

    # Make sure that the state parameter matches the one we created in the
    # authorization request
    if request.args['state'] != session.get('oauth2_state'):
        if 'oauth2_state' in session:
            del session['oauth2_state']
        return redirect(base_url + "?error=state_not_matching")

    # Clear oauth2_state from the session after validating it
    # to prevent potential replay attacks
    del session['oauth2_state']

    # Make sure that the authorization code is present
    if 'code' not in request.args:
        return redirect(base_url + "?error=no_auth_code")

    # Exchange the authorization code for an access token
    response = requests.post(provider_data['token_url'], data={
        'client_id': provider_data['client_id'],
        'client_secret': provider_data['client_secret'],
        'code': request.args['code'],
        'grant_type': 'authorization_code',
        'redirect_uri': f"{base_url}/api/auth/callback/{provider}",
    }, headers={'Accept': 'application/json'})

    if response.status_code != 200:
        return redirect(base_url + "?error=exchange_failure")

    oauth2_token = response.json().get('access_token')

    if not oauth2_token:
        return redirect(base_url + "?error=no_oauth_token")

    # Use the access token to get the user's email address
    response = requests.get(provider_data['userinfo']['url'], headers={
        'Authorization': 'Bearer ' + oauth2_token,
        'Accept': 'application/json',
    })
    if response.status_code != 200:
        return redirect(base_url + "?error=acquisition_failure")

    email = provider_data['userinfo']['email'](response.json())
    user = User.get_or_create_by_email(email)

    # Nice... we can log in :)
    login_user(user)
    return redirect(base_url)
