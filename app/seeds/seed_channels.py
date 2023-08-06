from app.models import Channel
from app.models.db import db, environment, SCHEMA
from sqlalchemy.sql import text


def seed_channels(users):
    demo = users[0]
    marnie = users[1]
    bobbie = users[2]
    channel1 = Channel(
        name = 'General',
        subject = 'This channel is for team-wide communication.',
        is_private = False,
        is_direct = False,
        owner = bobbie
    )
    channel2 = Channel(
        name = 'Help-requests',
        subject = 'For technical issues! Ask for help or aid in answering a question.',
        is_private = False,
        is_direct = False,
        owner = marnie
    )
    channel3 = Channel(
        name = '',
        subject = '',
        is_private = True,
        is_direct = True,
        owner = demo
    )

    channel4 = Channel(
        name='Cooking',
        subject='Share recipes and cooking tips',
        is_private=False,
        is_direct=False,
        owner=bobbie
    )

    db.session.add(channel1)
    db.session.add(channel2)
    db.session.add(channel3)
    db.session.add(channel4)

    channel1.users.append(demo)
    channel1.users.append(marnie)
    channel1.users.append(bobbie)
    channel2.users.append(marnie)
    channel2.users.append(demo)
    channel3.users.append(demo)
    channel3.users.append(marnie)
    channel3.users.append(bobbie)
    channel4.users.append(bobbie)
    db.session.commit()

    return (channel1, channel2, channel3)


def undo_channels():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.channels RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM channels")
    db.session.commit()
