import { useModal } from "../../context/Modal";

export default function ChatEmojiModal({setChatInput, chatInput}) {
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
        "😨","😧","😦","😱","😫","😩",
        "😮","😯","😲","😺","😸","🐱","😳","😞","😖","😈","😬","🤨","😉","😜","😣","😖","🤒","😷","🤢","😎","😪","🙂","😊","😁","🦀","💵","😔"
    ];
    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    width: "300px",
                    justifyContent: "center",
                }}
            >
                {emojis.map((emoji) => (
                    <button
                        style={{
                            padding: "2px 2px",
                            margin: "5px 5px",
                            fontSize: "18px",
                            borderRadius: "25%"
                        }}
                        onClick={(e) => {
                            setChatInput(chatInput + emoji)
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
