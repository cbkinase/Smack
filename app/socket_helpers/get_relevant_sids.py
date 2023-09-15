from app.models import db, Channel, channel_user


def get_relevant_user_ids(user):
    # Current criteria: has a shared DM channel.
    # Should probably do some sort of caching
    users_in_direct_channels = db.session.query(channel_user.c.users_id)\
    .join(Channel, channel_user.c.channels_id == Channel.id)\
    .filter(
        Channel.is_direct == True,
        channel_user.c.users_id != user.id
    ).distinct().all()

    user_ids = [item[0] for item in users_in_direct_channels]
    return user_ids


def get_relevant_sids(user, redis):
    all_sids = []

    # Fetch all user keys
    user_keys = redis.keys("user:*")

    # For each user key, fetch all SIDs
    for user_key in user_keys:
        sids_for_user = redis.hkeys(user_key)
        all_sids.extend(sids_for_user)

    return all_sids
