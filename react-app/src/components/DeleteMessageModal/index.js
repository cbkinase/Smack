import { useModal } from "../../context/Modal/Modal";
import { deleteMessage } from "../../store/messages";
import { useDispatch } from "react-redux";
import "./DeleteMessage.css";

export default function DeleteMessageModal({ msg, socket }) {
	const { closeModal } = useModal();
	const dispatch = useDispatch();

	const handleDelete = () => {
		socket.emit(
			"delete",
			{ message_id: msg.id, channel_id: msg.channel_id },
			(res) => {
				if (res.status === "success") {
					dispatch(deleteMessage(msg.id));
				} else {
					if (process.env.NODE_ENV !== "production") {
						console.log(res);
					}
				}
			},
		);
		closeModal();
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				padding: "10px 15px 10px 15px",
			}}
		>
			<h2
				style={{
					fontWeight: "bold",
					fontSize: "18px",
					marginBottom: "10px",
				}}
			>
				Confirm Deletion
			</h2>
			<h4 style={{ fontWeight: "normal", marginBottom: "10px" }}>
				Are you sure you want to remove this message?
			</h4>
			<button
				style={{
					marginBottom: "10px",
					marginTop: "5px",
					width: "100%",
				}}
				className="decorated-button-delete"
				onClick={handleDelete}
			>
				Confirm
			</button>
			<button
				style={{ width: "100%" }}
				className="decorated-button-delete alt-color-button-2"
				onClick={closeModal}
			>
				Cancel
			</button>
		</div>
	);
}
