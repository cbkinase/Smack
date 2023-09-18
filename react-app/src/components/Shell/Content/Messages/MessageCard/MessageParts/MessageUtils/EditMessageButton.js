import React from "react";
import { addMessage } from "../../../../../../../store/messages";
import changeAdjustText from "../../../../../../../utils/changeAdjustText";

let updatedMessage;

export default function EditMessageButton ({
	message,
	dispatch,
	socket,
	channelId,
	editing
}) {
	const handleEdit = async (e, msg) => {
		document.getElementById("edit-msg-form").remove();
		e.preventDefault();

		const socketPayload = {
			content: updatedMessage,
			user_id: msg.user_id,
			channel_id: channelId,
			is_pinned: msg.is_pinned,
			message_id: msg.id
		};

		socket.emit("edit", socketPayload, (res) => {
			if (res.status === "success") {
				dispatch(addMessage(res.message));
			} else {
				if (process.env.NODE_ENV !== "production") {
					console.log(res);
				}
			}
		});
	};

	const updateEditMessageInput = (e) => {
		updatedMessage = e.target.value;
	};

	const editMode = (e, msg) => {
		const content = document.getElementById(`msg-content-${msg.id}`);

		const editForm = document.createElement("form");
		editForm.id = "edit-msg-form";

		editForm.onsubmit = (e) => handleEdit(e, msg);

		const editInputBox = document.createElement("textarea");
		editInputBox.onchange = updateEditMessageInput;

		editInputBox.value = msg.content;
		editInputBox.style.backgroundColor = "#FFFFFF";
		editInputBox.style.padding = "5px 10px";
		editInputBox.style.marginTop = "5px";
		editInputBox.style.resize = "none";
		editInputBox.style.border = "1px solid #dddddd";
		editInputBox.style.borderRadius = "8px";
		editInputBox.style.width = "100%";

		const editInputSubmit = document.createElement("button");
		editInputSubmit.type = "submit";
		editInputSubmit.textContent = "Save";
		editInputSubmit.style.padding = "1px 4px";
		editInputSubmit.style.marginRight = "5px";
		editInputSubmit.style.marginTop = "4px";

		const cancelEditInput = document.createElement("button");
		cancelEditInput.textContent = "Cancel";
		cancelEditInput.style.padding = "1px 4px";
		cancelEditInput.style.marginTop = "4px";
		cancelEditInput.onclick = () => {
			document.getElementById("edit-msg-form").remove();
			editing = false;
		};

		editForm.appendChild(editInputBox);
		editForm.appendChild(editInputSubmit);
		editForm.appendChild(cancelEditInput);
		if (!editing) content.appendChild(editForm);
	};

	return (
		<span
			onClick={(e) => {
				editMode(e, message);
				editing = true;
			}}
			onMouseOver={() =>
				changeAdjustText(
					"Edit Message",
					message.id
				)
			}
			onMouseOut={() =>
				changeAdjustText("", message.id)
			}
			className="message-adjust-edit"
		>

			<i className="far fa-edit"></i>

		</span>
	);
}
