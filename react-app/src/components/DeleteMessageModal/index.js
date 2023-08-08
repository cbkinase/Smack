import { useModal } from "../../context/Modal/Modal";
import { destroyMessage } from "../../store/messages";
import { useDispatch } from "react-redux";
import "./DeleteMessage.css";

export default function DeleteMessageModal({ user, msg, socket }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const handleDelete = (e) => {
        dispatch(destroyMessage(msg.id));
        socket.emit("delete", { user: user.username, msg: msg.content });
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
                Confirm Delete
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
                Yes (Delete Message)
            </button>
            <button
                style={{ width: "100%" }}
                className="decorated-button-delete alt-color-button-2"
                onClick={closeModal}
            >
                No (Keep Message)
            </button>
        </div>
    );
}
