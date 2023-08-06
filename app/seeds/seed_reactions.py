from app.models import Reaction
from app.models.db import db, environment, SCHEMA
from sqlalchemy.sql import text


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
