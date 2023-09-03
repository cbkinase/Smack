import { emojis } from "../../utils/Emoji";

export default function EmojiModal({ onClickFunction }) {

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
                    <button key={emoji} className="reaction-icon" onClick={onClickFunction} >
                        {emoji}
                    </button>
                ))}
            </div>
        </>
    );
}
