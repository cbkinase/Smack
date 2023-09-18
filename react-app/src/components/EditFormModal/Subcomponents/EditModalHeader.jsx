import determineChannelName from "../../../utils/determineChannelName";

export default function EditModalHeader({ currChannel, user, closeModal }) {
	return (
		<div style={{ paddingLeft: "17px" }} className="edit-modal-header">
			<div className="edit-modal-title">
				{determineChannelName(currChannel, user)}
			</div>
			<button
				style={{ top: "24px" }}
				className="edit-modal-close-btn"
				onClick={closeModal}
			>
				<i className="fa-solid fa-x"></i>
			</button>
		</div>
	);
}
