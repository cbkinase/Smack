from app.models import Message
from app.models.db import db, environment, SCHEMA


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
        content="hello there from Demo", is_pinned=True, users=demo, channels=channel1
    )
    demo_message_2 = Message(
        content="this is my second message, demo signing out",
        is_pinned=False,
        users=demo,
        channels=channel1,
    )
    msgs.append(demo_message_1)
    msgs.append(demo_message_2)

    marnie_message_1 = Message(
        content="hello there from Cam", is_pinned=False, users=marnie, channels=channel2
    )
    marnie_message_2 = Message(
        content="this is my second message, Cam signing out",
        is_pinned=False,
        users=marnie,
        channels=channel2,
    )
    msgs.append(marnie_message_1)
    msgs.append(marnie_message_2)

    bob_message_1 = Message(
        content="hello there from Cyn", is_pinned=False, users=bobbie, channels=channel3
    )
    bob_message_2 = Message(
        content="this is my second message, Cyn signing out",
        is_pinned=False,
        users=bobbie,
        channels=channel3,
    )
    msgs.append(bob_message_1)
    msgs.append(bob_message_2)

    # General messages
    gm_1 = Message(
        content="Anyone here interviewed with Kickstarter recently? Could you please DM me. I have an interview coming up next week. Thanks in advance.",
        is_pinned=False,
        users=bobbie,
        channels=channel1,
    )
    gm_2 = Message(
        content="Anyone have recs for the most comfortable headphones?",
        is_pinned=False,
        users=marnie,
        channels=channel1,
    )
    gm_3 = Message(
        content="I recently stumbled upon a Haskell course while trying to explore functional programming. The whole concept is intriguing, especially coming from a mainly OOP background with Java. I mean, immutability everywhere and pure functions — it's both daunting and fascinating. Anyone here dabbled with it before?",
        is_pinned=False,
        users=bobbie,
        channels=channel1,
    )

    gm_4 = Message(
        content="Hi Cynthia, I've not worked with Haskell per se, but I've incorporated a lot of functional programming principles into my JavaScript and Python work. Libraries like Lodash and tools like Redux really lean into those functional paradigms. It's fascinating how you start spotting these patterns and principles across different tech stacks once you're aware of them.",
        is_pinned=False,
        users=marnie,
        channels=channel1,
    )

    gm_5 = Message(
        content="I actually looked into Haskell a while back. The functional paradigm is a brain twister at first, especially if you're coming from OOP. But once it clicks, it's a neat way to solve problems. It's all about patterns and data flow. The part that stood out to me most wasn't even the language syntax or features, but the way it made me think about problems. Designing without side effects, using recursion heavily, and thinking in terms of data transformations was really illuminating.",
        is_pinned=False,
        users=demo,
        channels=channel1,
    )

    msgs.append(gm_1)
    msgs.append(gm_2)
    msgs.append(gm_3)
    msgs.append(gm_4)
    msgs.append(gm_5)

    for msg in msgs:
        db.session.add(msg)

    other_messages = Message.create(
        40, [demo, marnie, bobbie], [channel1, channel2, channel3]
    )
    db.session.add_all(other_messages)
    db.session.commit()
    return (*msgs, *other_messages)


def undo_messages():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute("DELETE FROM messages")
    db.session.commit()
