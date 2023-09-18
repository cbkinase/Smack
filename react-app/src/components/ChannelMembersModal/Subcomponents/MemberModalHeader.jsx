import determineChannelName from "../../../utils/determineChannelName";
import { useModal } from "../../../context/Modal/Modal";

export default function MemberModalHeader ({ user, channel }) {
	const { closeModal } = useModal();
	return (
		<div className="channels-header">
			<h2 style={{ marginTop: "-10px" }}>{determineChannelName(channel, user)}</h2>
			<button style={{ top: "18px" }} className="edit-modal-close-btn" onClick={closeModal}>
				<i className="fa-solid fa-x"></i>
			</button>
		</div>
	);
}
