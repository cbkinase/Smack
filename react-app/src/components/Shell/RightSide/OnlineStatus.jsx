export default function OnlineStatus() {
    const online = <svg height="20" width="20" viewBox="0 0 20 20">
        <path fill="currentColor" d="M14.5 10a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"></path>
        </svg>

    return (
    <span style={{display: "flex"}}>
        <span style={{color: "#007a5a", paddingRight: "5px"}}>{online}</span>
        Online
    </span>)
}
