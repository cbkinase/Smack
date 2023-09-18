export default function OfflineStatus ({ iconOnly }) {
	let away;

	if (iconOnly === "avatar") {
		away = <svg height="20" width="20" viewBox="0 0 20 20">
			{/* Outer Circle (Ring) */}
			<path
				fill="#333333" // Dark grey
				d="M10 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z">
			</path>

			{/* Inner Circle */}
			<path
				fill="#B0B0B0" // Lighter shade of grey
				d="M10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z">
			</path>
		</svg>;
	} else {
		away = <svg height="20" width="20" viewBox="0 0 20 20">
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="M7 10a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-4.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z"
				clipRule="evenodd">
			</path>
		</svg>;
	}

	const outerStyle = iconOnly === "avatar" ? {} : { display: "flex" };

	return (
		<span style={outerStyle}>
			<span style={iconOnly ? {} : { paddingRight: "5px" }}>{away}</span>
			{iconOnly ? "" : "Away"}
		</span>);
}
