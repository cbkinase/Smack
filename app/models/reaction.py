from .db import db, environment, SCHEMA

class Reaction(db.Model):
    __tablename__ = 'reactions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False, db.ForeignKey("users.id"))
    channel_id = db.Column(db.Integer, nullable=False, db.ForeignKey("channels.id"))
    reaction = db.Column(db.Enum, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'channel_id': self.channel_id,
            'reaction': self.reaction,
        }