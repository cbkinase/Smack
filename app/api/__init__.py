from .auth_routes import auth_routes
from .channel_routes import channel_routes
from .message_routes import message_routes
from .user_routes import user_routes


def register_api_blueprints(app):
    blueprints = [
        (user_routes, '/api/users'),
        (auth_routes, '/api/auth'),
        (message_routes, '/api/messages'),
        (channel_routes, '/api/channels'),
    ]

    for blueprint, prefix in blueprints:
        app.register_blueprint(blueprint, url_prefix=prefix)
