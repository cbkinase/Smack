from .db import db, environment, SCHEMA

class Message(db.Model):
    __tablename__ = 'messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    channel_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("channels.id")), nullable=False)
    content = db.Column(db.Text, nullable=False)
    is_pinned = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now())

    channels = db.relationship("Channel", back_populates="messages")
    users = db.relationship("User", back_populates="messages")
    reactions = db.relationship("Reaction", back_populates="messages")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "channel_id": self.channel_id,
            "content": self.content,
            "is_pinned": self.is_pinned,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
