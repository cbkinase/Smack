from .db import db, environment, SCHEMA, add_prefix_for_prod
from faker import Faker
from random import choice, randint
from datetime import datetime


class Message(db.Model):
    __tablename__ = 'messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    channel_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("channels.id")))
    content = db.Column(db.Text, nullable=False)
    is_pinned = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now())

    channels = db.relationship("Channel", back_populates="messages")
    users = db.relationship("User", back_populates="messages")
    reactions = db.relationship("Reaction", back_populates="messages", cascade="all, delete, delete-orphan")
    attachments = db.relationship("Attachment", back_populates="message", cascade="all, delete, delete-orphan")


    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "channel_id": self.channel_id,
            "content": self.content,
            "is_pinned": self.is_pinned,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "User": self.users.to_dict(),
            "Reactions": {reaction.id:reaction.to_dict() for reaction in self.reactions},
            "Attachments": {attachment.id: attachment.to_dict() for attachment in self.attachments}
        }


    def to_dict_socket(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "channel_id": self.channel_id,
            "content": self.content,
            "is_pinned": self.is_pinned,
            "created_at": self.created_at.strftime('%a, %d %b %Y %H:%M:%S GMT'),
            "updated_at": self.updated_at.strftime('%a, %d %b %Y %H:%M:%S GMT'),
            "User": self.users.to_dict(),
            "Reactions": {reaction.id: reaction.to_dict() for reaction in self.reactions},
            "Attachments": {attachment.id: attachment.to_dict() for attachment in self.attachments}
        }


    @classmethod
    def create(cls, qty, users, channels):
        fake = Faker()

        return [
            cls(users=choice(users),
                channels=choice(channels),
                content=fake.sentence(nb_words = randint(3, 100)))
            for _ in range(qty)]
