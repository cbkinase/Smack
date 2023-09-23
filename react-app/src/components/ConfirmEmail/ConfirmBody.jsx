import { useNavigate } from "react-router-dom";

export default function ConfirmBody({ user, resend, activationFailed }) {
	const navigate = useNavigate();
	async function requestNewLink() {
		const baseURL = window.location.origin;
		await fetch(`/api/auth/confirm?source=${encodeURIComponent(baseURL)}`);
		navigate("/resend");
	}

	let lowerText;
	if (resend) {
		lowerText = "Please wait a moment while the email is delivered.";
	} else if (activationFailed) {
		lowerText = `No problem, we can send another one to you.`;
	} else {
		lowerText = "Didn't receive a confirmation email?";
	}

	return (
		<>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					padding: "40px 0px",
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
						height: "1px",
						width: "100%",
						backgroundColor: "#dddddd",
					}}
				></div>
			</div>

			<div
				style={{
					textAlign: "center",
					fontSize: "18px",
					color: "#454245",
				}}
			>
				<b>{lowerText}</b>

				<br />
				{resend ? null : (
					<button className="create-account" onClick={requestNewLink}>
						Request a new activation link
					</button>
				)}
			</div>
		</>
	);
}
