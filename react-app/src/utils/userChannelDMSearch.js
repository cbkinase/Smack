export default function userChannelDMSearch(
	user_channels,
	currUser,
	otherUser,
) {
	/*

    Given an object of user_channels, a current user, and an 'other' user,
    we need to determine whether such a DM already exists.
    This logic is important for when we click on the "message" button
    in the right sidebar.

    Overall:
    - if the channel already exists, route the current user to
    that channel.
    - if not, create the DM channel and add both users as members

    (some of this logic is handled outside the function, but that's the goal)

    */
	const isSelf = currUser.id === otherUser.id;

	const findMatchingChannel = (channel) => {
		// Ignore non-direct channels
		if (!channel.is_direct) return false;

		const memberCount = Object.keys(channel.Members).length;

		// In which currUser and otherUser are the same
		if (isSelf) {
			return memberCount === 1;
		}

		// In which currUser and otherUser are different
		const bothMembersPresent =
			channel.Members[currUser.id] && channel.Members[otherUser.id];
		return memberCount === 2 && bothMembersPresent;
	};

	const channel = Object.values(user_channels).find(findMatchingChannel);

	return channel;
}
