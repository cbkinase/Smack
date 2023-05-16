from .db import db, environment, SCHEMA, add_prefix_for_prod

class Attachment(db.Model):
    __tablename__ = 'attachments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    message_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("messages.id")))
    content = db.Column(db.Text, nullable=False)

    user = db.relationship("User", back_populates="attachments")
    message = db.relationship("Message", back_populates="attachments")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "message_id": self.message_id,
            "content": self.content
        }
