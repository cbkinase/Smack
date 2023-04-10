from .db import db, environment, SCHEMA

import enum

class Emoji(enum.Enum):
    LIKE = "like"
    DISLIKE = "dislike"

class Reaction(db.Model):
    __tablename__ = 'reactions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    message_id = db.Column(db.Integer, db.ForeignKey("messages.id"), nullable=False)
    reaction = db.Column(db.Enum(Emoji), nullable=False)

    messages = db.relationship("Message", back_populates="reactions")
<<<<<<< HEAD
    users = db.relationship("User", back_populates="reactions")
=======
    user = db.relationship("User", back_populates="reactions")
>>>>>>> f2aa4e3c8b1920cf2cce18ba5942a73df37f0a44

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'channel_id': self.channel_id,
            'reaction': self.reaction,
        }