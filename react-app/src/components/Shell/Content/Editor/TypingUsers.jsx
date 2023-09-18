import "./TypingUsers.css";

export default function TypingUsers ({ typingUsers }) {
	const users = Object.values(typingUsers);

	if (users.length === 0) { return null; }

	function renderTypingUsers (users) {
		if (users.length === 1) {
			return <p className="typing-indicator">
				<span className="typing-users">{users[0]}</span> is typing</p>;
		}
		if (users.length === 2) {
			return <p className="typing-indicator">
				<span className="typing-users">{users[0]}</span> and {" "}
				<span className="typing-users">{users[1]}</span> are typing</p>;
		}
		if (users.length > 2) {
			return <p className="typing-indicator">
				<span className="typing-users">Several people</span> are typing</p>;
		}
	}

	return (
		<div id="typing-indicator-container">
			{renderTypingUsers(users)}
		</div>
	);
}
