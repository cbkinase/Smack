from flask.cli import AppGroup
from app.models.db import environment, db
from app.models import channel_user, Attachment
from .seed_users import seed_users, undo_users
from .seed_channels import seed_channels, undo_channels
from .seed_messages import seed_messages, undo_messages
from .seed_reactions import seed_reactions, undo_reactions


def undo_channel_users():
    try:
        # delete all entries from the channel_user table
        num_deleted = db.session.query(channel_user).delete()
        db.session.commit()
        print(f"Deleted {num_deleted} entries from channel_users")
    except Exception as e:
        db.session.rollback()
        print(f"Error occurred while deleting entries from channel_users: {e}")


def undo_attachments():
    try:
        num_deleted = db.session.query(Attachment).delete()
        db.session.commit()
        print(f"Deleted {num_deleted} entries from Attachment")
    except Exception as e:
        db.session.rollback()
        print(f"Error occurred while deleting entries from Attachment: {e}")


# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup("seed")


# Creates the `flask seed all` command
@seed_commands.command("all")
def seed():
    if environment == "production":
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in seed_users.py undo_users function).
        undo_attachments()
        undo_reactions()
        undo_messages()
        undo_channel_users()
        undo_channels()
        undo_users()

    users = seed_users()
    channels = seed_channels(users)
    msgs = seed_messages(users, channels)
    seed_reactions(users, msgs)


# Creates the `flask seed undo` command
@seed_commands.command("undo")
def undo():
    undo_attachments()
    undo_reactions()
    undo_messages()
    undo_channel_users()
    undo_channels()
    undo_users()
