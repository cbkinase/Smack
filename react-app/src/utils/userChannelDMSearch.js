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

	let obj_arr = Object.values(user_channels);

	if (currUser.id === otherUser.id) {
		obj_arr = obj_arr.filter(
			(channel) =>
				channel.is_direct &&
				Object.values(channel.Members).length === 1,
		);
		return obj_arr[0];
	}
	obj_arr = obj_arr.filter(
		(channel) =>
			channel.is_direct && Object.values(channel.Members).length === 2,
	);
	obj_arr = obj_arr.filter(
		(channel) =>
			channel.Members[currUser.id] && channel.Members[otherUser.id],
	);

	return obj_arr[0];
}
