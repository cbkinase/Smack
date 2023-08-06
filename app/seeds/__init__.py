from flask.cli import AppGroup
from app.models.db import db, environment, SCHEMA
from app.models import Channel, User, Message, Reaction
from sqlalchemy.sql import text



# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo', email='demo@aa.io', password='password', first_name='Demo', last_name='User', avatar='https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/330px-President_Barack_Obama.jpg', bio='Hello, I\'m Demo User.  Nice to meet you!')
    marnie = User(
        username='marnie', email='marnie@aa.io', password='password', first_name='Cameron', last_name='Beck', avatar="https://cbkinase.github.io/images/1683215861457.jfif", bio='Hello, I\'m Cameron Beck.  Nice to meet you!')
    bobbie = User(
        username='bobbie', email='bobbie@aa.io', password='password', first_name='Cynthia', last_name='Liang', avatar="https://media.licdn.com/dms/image/D5603AQHakP57WMkLXQ/profile-displayphoto-shrink_100_100/0/1683151843029?e=1697068800&v=beta&t=a-4a-yjPaCCqixbebU1hg-Gp5yBWyd2c0EsuP5SUy64", bio='Hello, I\'m Cynthia Liang.  Nice to meet you!')

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.commit()
    return (demo, marnie, bobbie)


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
        name = 'Help requests',
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


def seed_messages(users, channels):
    demo = users[0]
    marnie = users[1]
    bobbie = users[2]
    channel1 = channels[0]
    channel2 = channels[1]
    channel3 = channels[2]
    # Seed messages
    msgs = []
    demo_message_1 = Message(
        content='hello there from Demo', is_pinned=True, users=demo, channels=channel1)
    demo_message_2 = Message(
        content='this is my second message, demo signing out', is_pinned=False, users=demo, channels=channel1)
    msgs.append(demo_message_1)
    msgs.append(demo_message_2)

    marnie_message_1 = Message(
        content='hello there from Cam', is_pinned=False, users=marnie, channels=channel2)
    marnie_message_2 = Message(
        content='this is my second message, Cam signing out', is_pinned=False, users=marnie, channels=channel2)
    msgs.append(marnie_message_1)
    msgs.append(marnie_message_2)

    bob_message_1 = Message(
        content='hello there from Cyn', is_pinned=False, users=bobbie, channels=channel3)
    bob_message_2 = Message(
        content='this is my second message, Cyn signing out', is_pinned=False, users=bobbie, channels=channel3)
    msgs.append(bob_message_1)
    msgs.append(bob_message_2)


    # General messages
    gm_1 = Message(
        content="Anyone here interviewed with Kickstarter recently? Could you please DM me. I have an interview coming up next week. Thanks in advance.", is_pinned=False, users=bobbie, channels=channel1
    )
    gm_2 = Message(
        content="Anyone have recs for the most comfortable headphones?", is_pinned=False, users=marnie, channels=channel1
    )
    gm_3 = Message(
        content="I recently stumbled upon a Haskell course while trying to explore functional programming. The whole concept is intriguing, especially coming from a mainly OOP background with Java. I mean, immutability everywhere and pure functions — it's both daunting and fascinating. Anyone here dabbled with it before?", is_pinned=False, users=bobbie, channels=channel1
    )

    gm_4 = Message(
        content="Hi Cynthia, I've not worked with Haskell per se, but I've incorporated a lot of functional programming principles into my JavaScript and Python work. Libraries like Lodash and tools like Redux really lean into those functional paradigms. It's fascinating how you start spotting these patterns and principles across different tech stacks once you're aware of them.", is_pinned=False, users=marnie, channels=channel1
    )

    gm_5 = Message(
        content="I actually looked into Haskell a while back. The functional paradigm is a brain twister at first, especially if you're coming from OOP. But once it clicks, it's a neat way to solve problems. It's all about patterns and data flow. The part that stood out to me most wasn't even the language syntax or features, but the way it made me think about problems. Designing without side effects, using recursion heavily, and thinking in terms of data transformations was really illuminating.", is_pinned=False, users=demo, channels=channel1
    )

    msgs.append(gm_1)
    msgs.append(gm_2)
    msgs.append(gm_3)
    msgs.append(gm_4)
    msgs.append(gm_5)

    for msg in msgs:
        db.session.add(msg)

    db.session.commit()
    return tuple(msgs)


def undo_messages():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM messages")
    db.session.commit()


def seed_reactions(users, messages):
    demo = users[0]
    marnie = users[1]
    bobbie = users[2]
    demo_message_1, demo_message_2, marnie_message_1, marnie_message_2, bob_message_1, bob_message_2, gm_1, gm_2, gm_3, gm_4, gm_5 = messages

    rctions = []
    reaction_marnie_demo_message_2 = Reaction(
        user=marnie, messages=demo_message_2, reaction="👍"
    )
    rctions.append(reaction_marnie_demo_message_2)

    reaction_bobbie_demo_message_2 = Reaction(
        user=bobbie, messages=demo_message_2, reaction="👍"
    )
    rctions.append(reaction_bobbie_demo_message_2)

    reaction_bobbie_marnie_message_2 = Reaction(
        user=bobbie, messages=marnie_message_2, reaction="👍"
    )
    rctions.append(reaction_bobbie_marnie_message_2)

    reaction_demo_bobbie_message_1 = Reaction(
        user=demo, messages=bob_message_1, reaction="👍"
    )
    rctions.append(reaction_demo_bobbie_message_1)

    for rction in rctions:
        db.session.add(rction)

    db.session.commit()

def undo_reactions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reactions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM reactions")
    db.session.commit()

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_reactions()
        undo_messages()
        undo_channels()
        undo_users()


    users = seed_users()
    # Add other seed functions here
    channels = seed_channels(users)
    msgs = seed_messages(users, channels)
    seed_reactions(users, msgs)



# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    # undo_users()

    # Add other undo functions here
    undo_reactions()
    undo_messages()
    undo_channels()
    undo_users()
