import { useModal } from "../../context/Modal/Modal";
import { createReaction } from "../../store/messages";

export default function ReactionModal({ socket, msg, dispatch }) {
    const { closeModal } = useModal();

    function handleAddReaction(e, msg, rxn) {
        e.preventDefault();

        let socketPayload = {
            message_id: msg.id,
            channel_id: msg.channel_id,
            reaction: rxn,
            id: rxn.id,
        };

        socket.emit("addReaction", socketPayload, (res) => {
            if (res.status === "success") {
                dispatch(createReaction(res.payload));
            }
            else {
                console.log(res);
            }
        });
    }
    const emojis = [
        "👍",
        "👎",
        "😀",
        "🤣",
        "😇",
        "🥰",
        "😛",
        "🤭",
        "😑",
        "🍆",
        "🙄",
        "😴",
        "💖",
        "💔",
        "💯",
        "👋",
        "😨", "😧", "😦", "😱", "😫", "😩", "👀",
        "😮", "😯", "😲", "😺", "😸", "🐱", "😳", "😞", "😖", "😈", "😬", "🤨", "😉", "😜", "😣", "🤒", "😷", "🤢", "😎", "😪", "🙂", "😊", "😁", "🦀", "💵", "😔"
    ];
    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    maxWidth: "320px",
                    justifyContent: "center",
                    gap: '2px'
                }}
            >
                {emojis.map((emoji) => (
                    <button key={emoji} className="reaction-icon"
                        onClick={(e) => {
                            handleAddReaction(e, msg, emoji);
                            closeModal();
                        }}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </>
    );
}
