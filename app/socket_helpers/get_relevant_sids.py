from app.models import db, channel_user


def get_relevant_user_ids(user):
    # Fetch the IDs of the channels that the user is in
    user_channels = db.session.query(channel_user.c.channels_id)\
        .filter(channel_user.c.users_id == user.id)\
        .subquery()

    # Fetch the IDs of the users in the same channels as the user
    users_in_mutual_channels = db.session.query(channel_user.c.users_id)\
        .join(user_channels, channel_user.c.channels_id == user_channels.c.channels_id)\
        .filter(channel_user.c.users_id != user.id)\
        .distinct()

    return {str(user_id[0]) for user_id in users_in_mutual_channels.all()}


def get_relevant_sids(user, online_users, redis):
    relevant_ids = get_relevant_user_ids(user)
    interlinked_online_users = relevant_ids.intersection(online_users)

    pipeline = redis.pipeline()
    for user_key in interlinked_online_users:
        pipeline.hkeys(f"user:{user_key}")

    all_sids = []
    for sids_for_user in pipeline.execute():
        all_sids.extend(sids_for_user)

    return all_sids
