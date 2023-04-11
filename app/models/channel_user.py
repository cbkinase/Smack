from email.policy import default
from .db import db, environment, SCHEMA, add_prefix_for_prod
import enum

class Roles(enum.Enum):
    owner = "owner"
    moderator = "moderator"
    member = "member"

channel_user = db.Table(
    'channel_users',
    db.Model.metadata,
    db.Column("users_id", db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True),
    db.Column("channels_id", db.Integer, db.ForeignKey(add_prefix_for_prod('channels.id')), primary_key=True),
    db.Column("role", db.Enum(Roles), nullable=False, default="member")
)

if environment == "production":
    channel_user.schema = SCHEMA