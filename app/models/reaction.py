from .db import db, environment, SCHEMA, add_prefix_for_prod
from random import choice

class Reaction(db.Model):
    __tablename__ = 'reactions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    message_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("messages.id")))
    reaction = db.Column(db.String, nullable=False)

    messages = db.relationship("Message", back_populates="reactions")
    user = db.relationship("User", back_populates="reactions")


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'message_id': self.message_id,
            'reaction': self.reaction
        }

    @classmethod
    def create(cls, qty, users, messages):
        emoji_choices = ["😂", "❤️", "👍", "🎉", "😳", "💯"]
        return [cls(user=choice(users),
                    messages=choice(messages),
                    reaction=choice(emoji_choices))
                    for _ in range(qty)]
