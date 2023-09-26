export default function OrSeparator() {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				padding: "30px 0px",
			}}
		>
			<div
				style={{
					height: "1px",
					width: "100%",
					backgroundColor: "#dddddd",
				}}
			></div>
			<div
				style={{
					padding: "0px 20px",
				}}
			>
				OR
			</div>
			<div
				style={{
					height: "1px",
					width: "100%",
					backgroundColor: "#dddddd",
				}}
			></div>
		</div>
	);
}
