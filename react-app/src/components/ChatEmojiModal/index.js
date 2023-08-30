import { useModal } from "../../context/Modal/Modal";

export default function ChatEmojiModal({ setChatInput }) {
    const { closeModal } = useModal();


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
                            setChatInput((prev) => prev + emoji + " ")
                            document.getElementsByClassName("editor-focus")[0].focus()
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
