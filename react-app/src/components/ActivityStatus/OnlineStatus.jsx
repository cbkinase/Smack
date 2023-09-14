export default function OnlineStatus({ iconOnly }) {
    let online;
    if (iconOnly === "avatar") {
        online = <svg height="20" width="20" viewBox="0 0 20 20">
        {/* Outer Circle (Ring) */}
        <path
            fill="#333333"
            d="M10 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z">
        </path>

        {/* Inner Circle */}
        <path
            fill="currentColor"
            d="M10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z">
        </path>
    </svg>
    }
    else {
        online = <svg height="20" width="20" viewBox="0 0 20 20">
        <path fill="currentColor" d="M14.5 10a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"></path>
        </svg>
    }

    const iconStyle = iconOnly ? {color: "#007a5a"} : {color: "#007a5a", paddingRight: "5px"};
    const outerStyle = iconOnly === "avatar" ? {} : {display: "flex"};

    return (
    <span style={outerStyle}>
        <span style={iconStyle}>{online}</span>
        {iconOnly ? "" : "Active"}
    </span>)
}
