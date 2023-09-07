from .db import db, environment, SCHEMA, add_prefix_for_prod
from faker import Faker
from random import choice

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

    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")),
                         nullable=True)

    owner = db.relationship("User", back_populates="owns_channel")
    messages = db.relationship("Message", back_populates="channels", cascade="all, delete, delete-orphan")
    users = db.relationship(
        "User",
        secondary='channel_users',
        back_populates="channels")

    def to_dict(self):
        base_dict = {
            'id': self.id,
            'owner_id': self.owner_id,
            'name': self.name,
            'subject': self.subject,
            'is_private': self.is_private,
            'is_direct': self.is_direct,
            'created_at': self.created_at,
        }
        base_dict["Members"] = {
            user.id : {
            "avatar": user.avatar,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "id": user.id,
            "bio": user.bio,
            }
            for user in self.users
        }
        return base_dict


    @classmethod
    def create(cls, qty, users):
        fake = Faker()
        return [cls(subject=fake.sentence(),
                    name=f"{fake.word().lower()}-{fake.word().lower()}",
                    owner=choice(users))
                    for _ in range(qty)]
