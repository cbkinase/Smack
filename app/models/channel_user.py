from email.policy import default
from .db import db, environment, SCHEMA
import enum


class Roles(enum.Enum):
    owner = "owner"
    moderator = "moderator"
    member = "member"


channel_user = db.Table(
    'channel_users',
    db.Model.metadata,
    db.Column("users_id", db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column("channels_id", db.Integer, db.ForeignKey('channels.id'), primary_key=True),
    db.Column("role", db.Enum(Roles), nullable=False, default="member")
)