from flask_wtf import FlaskForm
from wtforms import SelectField
from wtforms.validators import DataRequired

choices = [("like", "like"), ("dislike", "dislike")]


class ReactionForm(FlaskForm):
    message = SelectField("Reaction", choices=choices, validators=[DataRequired()])
