from .db import db, environment, SCHEMA
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from faker import Faker
from sqlalchemy.orm import joinedload


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    channels = db.relationship(
        "Channel",
        secondary='channel_users',
        back_populates="users")

    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    avatar = db.Column(db.String(255), default='https://ca.slack-edge.com/T0266FRGM-UQ46QH94Z-gc24d346e359-512')
    bio = db.Column(db.String(2000))

    channels_owned = db.relationship("Channel", back_populates="owner")
    reactions = db.relationship("Reaction", back_populates="user")
    messages = db.relationship("Message", back_populates="users")
    attachments = db.relationship("Attachment", back_populates="user")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'avatar': self.avatar,
            'bio': self.bio
        }

    @classmethod
    def create(cls, qty):
        fake = Faker()
        profiles = []
        # Ensure we don't fail the unique constraint on emails and usernames non-deterministically
        emails = set()
        usernames = set()

        while len(profiles) < qty:
            profile = fake.profile()
            if profile['mail'] not in emails and profile['username'] not in usernames:
                profiles.append(profile)
                emails.add(profile['mail'])
                usernames.add(profile['username'])

        new_users = [
            cls(username=user['username'],
                email=user['mail'],
                password="password",
                bio=fake.paragraph(),
                first_name=fake.first_name(),
                last_name=fake.last_name())
            for user in profiles]

        return new_users


    @classmethod
    def from_form(cls, form):
        user_info = {
            "username": form.data['username'],
            "email": form.data['email'],
            "password": form.data['password'],
            "first_name": form.data['first_name'],
            "last_name": form.data['last_name']
        }
        user = cls(**user_info)
        db.session.add(user)
        db.session.commit()
        return user


    @classmethod
    def find_by_email(cls, email):
        user = User.query.filter(User.email == email).first()
        return user


    @classmethod
    def get_all_channels_for_user(cls, user, Channel):
        user = User.query.options(
        joinedload(User.channels).joinedload(Channel.users),
    ).filter(User.id == user.id).first()
        return user


    def edit_from_form(self, form):
        self.first_name = form.data['first_name']
        self.last_name = form.data['last_name']
        self.avatar = form.data['avatar']
        self.bio = form.data['bio']
        db.session.commit()


    def join_channel(self, channel):
        self.channels.append(channel)
        db.session.commit()
