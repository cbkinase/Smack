import React from "react";
import OpenModalButton from "../../../../../../OpenModalButton";
import DeleteMessageModal from "../../../../../../DeleteMessageModal";
import changeAdjustText from "../../../../../../../utils/changeAdjustText";

export default function DeleteMessageButton({
	message,
	user,
	socket,
	dispatch,
}) {
	return (
		<span
			onMouseOver={() => changeAdjustText("Delete Message", message.id)}
			onMouseOut={() => changeAdjustText("", message.id)}
			className="message-adjust-delete"
		>
			<OpenModalButton
				modalComponent={
					<DeleteMessageModal
						socket={socket}
						msg={message}
						user={user}
						dispatch={dispatch}
					/>
				}
				className="far fa-trash-alt"
			/>
		</span>
	);
}
