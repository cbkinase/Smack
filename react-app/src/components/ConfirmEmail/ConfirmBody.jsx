import { useNavigate } from "react-router-dom";

export default function ConfirmBody({ user, resend }) {
	const navigate = useNavigate();
	async function requestNewLink() {
		await fetch("/api/auth/confirm");
		navigate("/resend");
	}

	const lowerText = resend
		? "Please wait a moment while the email is delivered"
		: "Didn't receive a confirmation email?";

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
