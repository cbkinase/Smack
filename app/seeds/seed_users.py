from app.models import User
from app.models.db import db, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo', confirmed=True, email='demo@aa.io', password='verysecurepassword??xd', first_name='Demo', last_name='User', avatar='https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/330px-President_Barack_Obama.jpg', bio='Hello, I\'m Demo User.  Nice to meet you!')
    marnie = User(
        username='marnie', confirmed=True, email='marnie@aa.io', password='password', first_name='Cameron', last_name='Beck', avatar="https://cbkinase.github.io/images/1683215861457.jfif", bio='Hello, I\'m Cameron Beck.  Nice to meet you!')
    bobbie = User(
        username='bobbie', confirmed=True, email='bobbie@aa.io', password='password', first_name='Cynthia', last_name='Liang', avatar="https://media.licdn.com/dms/image/D5603AQHakP57WMkLXQ/profile-displayphoto-shrink_100_100/0/1683151843029?e=1697068800&v=beta&t=a-4a-yjPaCCqixbebU1hg-Gp5yBWyd2c0EsuP5SUy64", bio='Hello, I\'m Cynthia Liang.  Nice to meet you!')

    other_users = User.create(10)
    users = (demo, marnie, bobbie, *other_users)
    db.session.add_all(users)
    db.session.commit()
    return users


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
