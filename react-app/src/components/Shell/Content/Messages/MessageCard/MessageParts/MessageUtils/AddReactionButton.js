import React from "react";
import OpenModalButton from "../../../../../../OpenModalButton";
import ReactionModal from "../../../../../../EmojiModal";
import changeAdjustText from "../../../../../../../utils/changeAdjustText";
import { useModal } from "../../../../../../../context/Modal/Modal";
import { createReaction } from "../../../../../../../store/messages";

export default function AddReactionButton ({ message, socket, dispatch }) {
	const { closeModal } = useModal();

	function handleAddReaction (e, msg, rxn) {
		e.preventDefault();

		const socketPayload = {
			message_id: msg.id,
			channel_id: msg.channel_id,
			reaction: rxn,
			id: rxn.id
		};

		socket.emit("addReaction", socketPayload, (res) => {
			if (res.status === "success") {
				dispatch(createReaction(res.payload));
			} else {
				if (process.env.NODE_ENV !== "production") {
					console.log(res);
				}
			}
		});
	}

	function handleReactionClick (e) {
		handleAddReaction(e, message, e.target.innerText);
		closeModal();
	}

	return (
		<span
			onMouseOver={() =>
				changeAdjustText("Add Reaction", message.id)
			}
			onMouseOut={() =>
				changeAdjustText("", message.id)
			}
			className="message-adjust-reaction"
		>
			<OpenModalButton
				modalComponent={<ReactionModal onClickFunction={handleReactionClick}/>}
				className="far fa-smile"
			/>
		</span>
	);
}
