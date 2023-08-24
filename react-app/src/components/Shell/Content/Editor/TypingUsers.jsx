export default function TypingUsers({ typingUsers }) {
    const users = Object.values(typingUsers);
    if (users.length === 0)
        return null;
    if (users.length === 1)
        return <div style={{height: "20px"}}><p>{users[0]} is typing...</p></div>;
    if (users.length === 2)
        return <div style={{height: "20px"}}><p>{users[0]} and {users[1]} are typing...</p></div>;
    if (users.length > 2)
        return <div style={{height: "20px"}}><p>Several people are typing...</p></div>;
}
