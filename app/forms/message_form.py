from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, ValidationError

class MessageForm(FlaskForm):
    message = StringField('Text', validators=[DataRequired()])