def get_channels_and_dms_for_user(user):
    return [channel.id for channel in user.channels]
