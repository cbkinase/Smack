from app.models import db, Channel
from sqlalchemy.sql import text

def seed_channels():
    channel1 = Channel(
        name = 'Channel1 Name',
        subject = 'Channel1 Subject',
        is_private = True,
        is_direct = True
    )
    channel2 = Channel(
        name = 'Channel2 Name',
        subject = 'Channel2 Subject',
        is_private = False,
        is_direct = False
    )
    channel3 = Channel(
        name = 'Channel3 Name',
        subject = 'Channel3 Subject',
        is_private = True,
        is_direct = False
    )

    db.session.add(channel1)
    db.session.add(channel2)
    db.session.add(channel3)
    db.session.commit()

def undo_channels():
    db.session.execute(text("DELETE FROM channels"))
    db.session.commit()