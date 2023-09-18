export default function isUserInChannel (user, channel) {
	const userId = user.id;
	const channelMembers = channel.Members;
	return channelMembers[userId] !== undefined;
}
