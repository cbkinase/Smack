import { useModal } from "../../context/Modal";

export default function ChatEmojiModal({ setChatInput, chatInput }) {
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
                            setChatInput(chatInput + emoji + " ")
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
