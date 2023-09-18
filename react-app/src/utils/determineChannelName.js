import userObjectToNameList from "./userObjectToNameList";

export default function determineChannelName(channel, user) {
	// The name displayed must be different depending on whether it's a DM or not.
	if (!channel.is_direct) return `# ${channel.name}`;
	else if (channel.is_direct && Object.values(channel.Members).length > 1) {
		const res = userObjectToNameList(channel.Members, user);
		return res.length <= 60 ? res : res.slice(0, 60) + "...";
	} else return `${user.first_name} ${user.last_name}`;
}
