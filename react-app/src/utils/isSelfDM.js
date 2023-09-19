export default function isSelfDM(channel, user) {
	if (!channel.is_direct) return false;
	const memberObj = channel.Members;
	for (let key in memberObj) {
		if (key !== user.id.toString()) {
			return false;
		}
	}
	return true;
}
