from .db import db, environment, SCHEMA

class Channel(db.Model):
    __tablename__ = 'channels'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    subject = db.Column(db.Text, nullable=False)
    is_private = db.Column(db.Boolean, nullable=False)
    is_direct = db.Column(db.Boolean, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'subject': self.subject,
            'is_private': self.is_private,
            'is_direct': self.is_direct
        }