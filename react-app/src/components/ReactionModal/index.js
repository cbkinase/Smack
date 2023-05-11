import { useModal } from "../../context/Modal";
import { thunkCreateReaction } from "../../store/messages";
import { useDispatch } from "react-redux";

export default function ReactionModal({ socket, msg, user, dispatch }) {
    const { closeModal } = useModal();

    function handleAddReaction(e, msg, rxn) {
        e.preventDefault();
        dispatch(thunkCreateReaction(msg.id, { reaction: rxn }));
        socket.emit("addReaction", {
            user: user.username,
            reaction: rxn,
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
        "😮", "😯", "😲", "😺", "😸", "🐱", "😳", "😞", "😖", "😈", "😬", "🤨", "😉", "😜", "😣", "😖", "🤒", "😷", "🤢", "😎", "😪", "🙂", "😊", "😁", "🦀", "💵", "😔"
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
                    <button className="reaction-icon"
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
