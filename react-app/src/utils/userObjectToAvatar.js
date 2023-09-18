import ActivityStatus from "../components/ActivityStatus";

export default function userObjectToAvatar(
	obj,
	currUser,
	bgColor,
	textColor,
	bdrColor,
) {
	/*

    Takes in an object that looks like
    {"1" :
        {"avatar": "", "first_name": "", "last_name": ""},
    "2" :
        { ... },
    }

    And returns some JSX to help render the proper icon on the
    left sidebar for direct messages depending on the number of users.

    */
	const new_obj = JSON.parse(JSON.stringify(obj));
	delete new_obj[currUser.id];

	const obj_arr = Object.values(new_obj);
	const activityStyles = {
		display: "inline",
		position: "absolute",
		marginLeft: "-25px",
		marginTop: "9px",
	};

	// This is the avatar we will render when a DM has only 1 other participant

	if (obj_arr.length === 1) {
		return (
			<span>
				<img
					src={obj_arr[0].avatar}
					alt="DM"
					style={{
						borderRadius: "5px",
						width: "20px",
						height: "20px",
						marginTop: "4px",
					}}
				></img>
				<ActivityStatus
					user={obj_arr[0]}
					iconOnly={"avatar"}
					styles={activityStyles}
				/>
			</span>
		);
	}

	if (obj_arr.length === 0) {
		// In this case, this is a "self" DM.
		return (
			<span>
				<img
					src={currUser.avatar}
					alt="DM"
					style={{
						borderRadius: "5px",
						width: "20px",
						height: "20px",
						marginTop: "4px",
					}}
				></img>
				<ActivityStatus
					user={currUser}
					iconOnly={"avatar"}
					styles={activityStyles}
				/>
			</span>
		);
	}

	// With multi-person DMs, we include one avatar and also show the number of other participants

	return (
		<>
			<span
				style={{
					position: "relative",
					borderRadius: "4px",
					width: "14px",
					height: "14px",
					top: "-4px",
					margin: "0px",
				}}
			>
				<img
					src={obj_arr[0].avatar}
					alt="DM"
					style={{
						borderRadius: "4px",
						width: "14px",
						height: "14px",
					}}
				/>
			</span>
			<span
				style={{
					position: "relative",
					height: "14px",
					width: "14px",
					fontSize: "9px",
					top: "5px",
					right: "15px",
					backgroundColor: bgColor,
					padding: "1px 3px 3px 3px",
					color: textColor,
					borderRadius: "4px",
					marginRight: "-15px",
					borderWidth: "1px",
					borderStyle: "solid",
					borderColor: bdrColor,
				}}
			>
				{obj_arr.length}
			</span>
		</>
	);
}
