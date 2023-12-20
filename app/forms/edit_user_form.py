from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Length, URL


class EditUserForm(FlaskForm):
    avatar = StringField("Avatar", validators=[URL(message="URL formatting issue.")])

    first_name = StringField(
        "First Name",
        validators=[DataRequired(), Length(max=20, message="1 to 20 characters.")],
    )
    last_name = StringField(
        "Last Name",
        validators=[DataRequired(), Length(max=20, message="1 to 20 characters.")],
    )

    bio = StringField(
        "Bio", validators=[Length(max=800, message="Maximum 800 characters.")]
    )
