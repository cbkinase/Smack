from app.models import db, channel_user
from sqlalchemy.sql import text

def seed_channelusers():
    cu1 = channel_user(
        user_id = 1,
        channel_id = 1,
        role = 'Test'
    )
    cu2 = channel_user(
        user_id = 2,
        channel_id = 2,
        role = 'Test'
    )
    cu3 = channel_user(
        user_id = 3,
        channel_id = 3,
        role = 'Test'
    )

    db.session.add(cu1)
    db.session.add(cu2)
    db.session.add(cu3)
    db.session.commit()

def undo_channelusers():
    db.session.execute(text("DELETE FROM channel_users"))
    db.session.commit()