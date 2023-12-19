import React from "react";
import toggleOnRightPane from "../../../../RightSide/toggleOnRightPane";

export default function MessageAvatar({
	messageUser,
	user,
	setSelectedUserRightBar,
}) {
	return (
		<div
			style={{ maxWidth: "36px", maxHeight: "36px", overflow: "hidden" }}
		>
			<img
				onClick={() => {
					setSelectedUserRightBar(messageUser);
					toggleOnRightPane();
				}}
				src={messageUser ? messageUser.avatar : user.avatar}
				alt={`${
					messageUser ? messageUser.first_name : user.first_name
				} ${messageUser ? messageUser.last_name : user.last_name}`}
				style={{
					borderRadius: "5px",
					width: "36px",
					height: "36px",
					cursor: "pointer",
				}}
			></img>
		</div>
	);
}
