export default function IdleStatus({ iconOnly }) {
	let idle;
	if (iconOnly === "avatar") {
		idle = (
			<svg height="20" width="20" viewBox="0 0 20 20">
				{/* Outer Circle (Ring) */}
				<path
					fill="#333333"
					d="M10 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z"
				></path>

				{/* Inner Circle */}
				<path
					fill="yellow"
					d="M10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
				></path>
			</svg>
		);
	} else {
		idle = (
			<svg height="20" width="20" viewBox="0 0 20 20">
				<path
					fill="green"
					fillRule="evenodd"
					d="M11.25 3.5a.75.75 0 0 0 0 1.5h1.847l-2.411 2.756A.75.75 0 0 0 11.25 9h3.5a.75.75 0 0 0 0-1.5h-1.847l2.411-2.756A.75.75 0 0 0 14.75 3.5h-3.5ZM7 10a3 3 0 0 1 3-3V5.5a4.5 4.5 0 1 0 4.5 4.5H13a3 3 0 1 1-6 0Z"
					clipRule="evenodd"
				></path>
			</svg>
		);
	}

	const outerStyle = iconOnly === "avatar" ? {} : { display: "flex" };

	return (
		<span style={outerStyle}>
			<span style={iconOnly ? {} : { paddingRight: "5px" }}>{idle}</span>
			{iconOnly ? "" : "Idle"}
		</span>
	);
}
