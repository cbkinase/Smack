import { emojis } from "../../utils/Emoji";
import "./EmojiStylesheet.css";

export default function EmojiModal ({ onClickFunction }) {
	function renderEmojiSection (emojiSectionTitle) {
		const emojiList = emojis[emojiSectionTitle];
		return (
			<section className="emoji-modal-section" key={emojiSectionTitle}>
				<h3 className="emoji-section-title">
					{emojiSectionTitle}
				</h3>
				<div className="emoji-section-content">
					{emojiList.map(renderButton)}
				</div>
			</section>
		);
	}

	function renderButton (emoji) {
		return <button key={emoji} className="reaction-icon" onClick={onClickFunction}> {emoji} </button>;
	}

	if (!emojis) return null;

	return (
		<div id="emoji-modal-container">
			{Object.keys(emojis).map(renderEmojiSection)}
		</div>
	);
}
