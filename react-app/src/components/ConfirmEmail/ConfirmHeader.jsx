import signinupLogo from "../../components/LoginSignupPage/smack-logo-black.svg";
import { NavLink } from "react-router-dom";

export default function ConfirmHeader({
	handleLogoClick,
	user,
	resend,
	activationFailed,
}) {
	const censorWord = function (str) {
		return str[0] + "*".repeat(str.length - 2) + str.slice(-1);
	};

	// eslint-disable-next-line
	const censorEmail = function (email) {
		const arr = email.split("@");
		return censorWord(arr[0]) + "@" + censorWord(arr[1]);
	};

	let h1Content;
	if (resend) {
		h1Content = "Check your email";
	} else if (activationFailed) {
		h1Content = "Code expired";
	} else {
		h1Content = "Confirm your email";
	}

	return (
		<div>
			<div style={{ textAlign: "center" }}>
				<NavLink onClick={handleLogoClick} to="/">
					<img
						src={`${signinupLogo}`}
						alt="Smack Logo"
						style={{ width: "145px " }}
					/>
				</NavLink>
			</div>

			<h1
				style={{
					textAlign: "center",
					fontSize: "48px",
					fontWeight: "700",
					paddingTop: "30px",
					paddingBottom: "14px",
				}}
			>
				{h1Content}
			</h1>
			{activationFailed ? (
				<p
					style={{
						textAlign: "center",
						fontSize: "16px",
						color: "#454245",
					}}
				>
					Sorry, your code for <b>{user.email}</b> has expired
				</p>
			) : (
				<p
					style={{
						textAlign: "center",
						fontSize: "16px",
						color: "#454245",
					}}
				>
					We've sent an email to you at <b>{user.email}</b>
				</p>
			)}
		</div>
	);
}
