import React, { useContext } from "react";
import toggleOnRightPane from "../../../../RightSide/toggleOnRightPane";
import SelectedUserRightBarContext from "../../../../../../context/SelectedUserRightBar/SelectedUserRightBarContext";
import formatLongDate from "../../../../../../utils/formatLongDate";

export default function MessageUsername({
	messageUser,
	messageUpdatedAt,
	user,
}) {
	const [, setSelectedUserRightBar] = useContext(SelectedUserRightBarContext);

	return (
		<div>
			<span
				className="message-card-name"
				onClick={() => {
					setSelectedUserRightBar(messageUser);
					toggleOnRightPane();
				}}
			>
				{messageUser ? messageUser.first_name : user.first_name}{" "}
				{messageUser ? messageUser.last_name : user.last_name}
			</span>
			<span className="message-card-time tooltip tooltip-higher">
				{new Date(messageUpdatedAt).toLocaleTimeString([], {
					hour: "numeric",
					minute: "2-digit",
				})}
				<span className="tooltiptext tooltiptext-higher">
					{formatLongDate(messageUpdatedAt)}
				</span>
			</span>
		</div>
	);
}
