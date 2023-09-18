import "./spinner.css";

export default function LoadingSpinner({ offset }) {
	return (
		<div
			className={
				offset
					? "spinner-load-container-offset"
					: "spinner-load-container"
			}
		>
			<div className="spinner-load"></div>
		</div>
	);
}
