from app.models import db, Channel, channel_user


def get_relevant_user_ids(user):
    # Current criteria: has a shared DM channel.
    # Should probably do some sort of caching (maybe?)
    users_in_direct_channels = db.session.query(channel_user.c.users_id)\
    .join(Channel, channel_user.c.channels_id == Channel.id)\
    .filter(
        Channel.is_direct == True,  # can always get rid of this if we decide to be less conservative
        channel_user.c.users_id != user.id
    ).distinct().all()

    user_ids = [item[0] for item in users_in_direct_channels]
    return user_ids


def get_relevant_sids(user, redis):
    # TODO: actually fix this implementation.
    # But note that this means when a user joins a channel,
    # We may want to update their 'interaction partners' so statuses don't get stale
    all_sids = []

    # Fetch all user keys
    user_keys = redis.keys("user:*")

    # For each user key, fetch all SIDs
    for user_key in user_keys:
        sids_for_user = redis.hkeys(user_key)
        all_sids.extend(sids_for_user)

    return all_sids
