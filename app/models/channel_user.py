from .db import db, environment, SCHEMA

class Channel_user(db.Model):
    __tablename__ = 'channel_users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    channel_id = db.Column(db.Integer, db.ForeignKey('channels.id'))
    role = db.Column(db.String)

    users = db.relationship("User", back_populates="channel_users")
    channels = db.relationship("Channel", back_populates="channel_users")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'channel_id': self.channel_id,
            'role': self.role
        }