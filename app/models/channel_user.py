from .db import db


channel_user = db.Table(
    'channel_users',
    db.Model.metadata,
    db.Column("users_id", db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column("channels_id", db.Integer, db.ForeignKey('channels.id'), primary_key=True)
)