from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError, Length
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')


class SignUpForm(FlaskForm):
    username = StringField(
        'Username', validators=[DataRequired(), username_exists, Length(
            min=5, max=20, message="Username must be 5 to 20 characters.")])
    email = StringField('Email', validators=[DataRequired(), Email(), user_exists])
    password = StringField('Password', validators=[DataRequired(), Length(
        min=8, max=25, message="Password must be 8 to 25 characters.")])
    first_name = StringField('First Name', validators=[DataRequired(), Length(
        max=20, message="First name must be 1 to 20 characters.")])
    last_name = StringField('Last Name', validators=[DataRequired(), Length(
        max=20, message="Last name must be 1 to 20 characters.")])
