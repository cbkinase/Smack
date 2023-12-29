from .db import db, environment, SCHEMA, add_prefix_for_prod
from faker import Faker
from random import choice, randint


class Channel(db.Model):
    __tablename__ = "channels"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    subject = db.Column(db.Text, nullable=False)
    is_private = db.Column(db.Boolean, nullable=False, index=True)
    is_direct = db.Column(db.Boolean, nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now())

    owner_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=True
    )

    owner = db.relationship("User", back_populates="channels_owned")
    messages = db.relationship(
        "Message", back_populates="channels", cascade="all, delete, delete-orphan"
    )
    users = db.relationship(
        "User", secondary="channel_users", back_populates="channels"
    )

    def to_dict(self):
        base_dict = {
            "id": self.id,
            "owner_id": self.owner_id,
            "name": self.name,
            "subject": self.subject,
            "is_private": self.is_private,
            "is_direct": self.is_direct,
            "created_at": self.created_at,
        }
        base_dict["Members"] = {
            user.id: {
                "avatar": user.avatar,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "id": user.id,
                "bio": user.bio,
            }
            for user in self.users
        }
        return base_dict

    def to_short_dict(self):
        return {
            "id": self.id,
            "owner_id": self.owner_id,
            "name": self.name,
            "subject": self.subject,
            "is_private": self.is_private,
            "is_direct": self.is_direct,
            "created_at": self.created_at,
        }

    def to_dict_n_members(self, n):
        base_dict = {
            "id": self.id,
            "owner_id": self.owner_id,
            "name": self.name,
            "subject": self.subject,
            "is_private": self.is_private,
            "is_direct": self.is_direct,
            "created_at": self.created_at,
        }
        base_dict["Members"] = {
            user.id: {
                "avatar": user.avatar,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "id": user.id,
                "bio": user.bio,
            }
            for user in self.users[0:n]
        }
        return base_dict

    @classmethod
    def create(cls, qty, users):
        fake = Faker()
        return [
            cls(
                subject=fake.sentence(),
                name=f"{fake.word().lower()}-{fake.word().lower()}",
                owner=choice(users),
                is_private=False,
                is_direct=bool(randint(0, 1)),
            )
            for _ in range(qty)
        ]

    @classmethod
    def from_request(cls, owner, req):
        channel_info = {
            "name": req.json.get("name"),
            "subject": req.json.get("subject"),
            "is_private": req.json.get("is_private"),
            "is_direct": req.json.get("is_direct"),
            "owner": owner,
        }
        new_channel = cls(**channel_info)
        db.session.add(new_channel)
        new_channel.users.append(owner)
        db.session.commit()
        return new_channel

    @classmethod
    def get_channel(cls, channel_id):
        return Channel.query.get(channel_id)

    @classmethod
    def get_all_channels(cls):
        return Channel.query.all()

    def edit_from_json(self, request):
        self.name = request.json.get("name")
        self.subject = request.json.get("subject")
        self.is_private = request.json.get("is_private")
        self.is_direct = request.json.get("is_direct")
        self.updated_at = db.func.now()
        db.session.commit()

    def remove_user(self, user):
        self.users.remove(user)
        db.session.commit()
