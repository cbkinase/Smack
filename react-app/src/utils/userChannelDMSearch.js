export default async function userChannelDMSearch(otherUser) {
	/*

    Overall:
    - if the channel already exists, route the current user to
    that channel.
    - if not, create the DM channel and add both users as members (or just 1 for self DM)

    (some of this logic is handled outside the function, but that's the goal)

    */

	const res = await fetch(
		`/api/channels/find-dm-channel?other_user_id=${otherUser.id}`,
	);

	if (!res.ok) {
		return null;
	}

	const channel = await res.json();
	return channel;
}
