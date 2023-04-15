import { useModal } from "../../context/Modal";
import { destroyMessage } from "../../store/messages";
import { useDispatch } from "react-redux";
// import "./DeleteMessage.css";

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
                border: "5px solid black",
            }}
        >
            <h2
                style={{
                    fontWeight: "bold",
                    fontSize: "22px",
                    marginBottom: "10px",
                }}
            >
                Confirm Delete
            </h2>
            <h3 style={{ fontWeight: "bold", marginBottom: "10px" }}>
                Are you sure you want to remove this message?
            </h3>
            <button
                style={{
                    marginBottom: "10px",
                    marginTop: "5px",
                    width: "100%",
                }}
                className="decorated-button"
                onClick={handleDelete}
            >
                Yes (Delete Message)
            </button>
            <button
                style={{ width: "100%" }}
                className="decorated-button alt-color-button-2"
                onClick={closeModal}
            >
                No (Keep Message)
            </button>
        </div>
    );
}
