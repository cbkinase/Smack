from app.models import db, channel_user
from app.cache_layer import cache


@cache.register(timeout=60, return_type=set)
def get_relevant_user_ids(user):
    # IDs of the channels that the user is in
    user_channels = (
        db.session.query(channel_user.c.channels_id)
        .filter(channel_user.c.users_id == user.id)
        .subquery()
    )

    # IDs of the users in the same channels as the user
    users_in_mutual_channels = (
        db.session.query(channel_user.c.users_id)
        .join(user_channels, channel_user.c.channels_id == user_channels.c.channels_id)
        .filter(channel_user.c.users_id != user.id)
        .distinct()
    )

    return {str(user_id[0]) for user_id in users_in_mutual_channels.all()}


def get_relevant_sids(user, online_users):
    relevant_ids = get_relevant_user_ids(user)
    interlinked_online_users = relevant_ids.intersection(online_users)

    all_sids = []

    sids_for_users = cache.bulk_get(
        keys=interlinked_online_users, prepend_key_with="user:", command="hkeys"
    )

    for sids_for_user in sids_for_users:
        all_sids.extend(sids_for_user)

    return all_sids
