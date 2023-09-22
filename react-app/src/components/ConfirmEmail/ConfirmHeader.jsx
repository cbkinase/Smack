import signinupLogo from "../../components/LoginSignupPage/smack-logo-black.svg";
import { NavLink } from "react-router-dom";

export default function ConfirmHeader({ handleLogoClick, user, resend }) {
	const censorWord = function (str) {
		return str[0] + "*".repeat(str.length - 2) + str.slice(-1);
	};

	const censorEmail = function (email) {
		const arr = email.split("@");
		return censorWord(arr[0]) + "@" + censorWord(arr[1]);
	};

	const h1Content = resend ? "Check your email" : "Confirm Your Account";

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
					fontSize: "41px",
					fontWeight: "700",
					paddingTop: "30px",
					paddingBottom: "14px",
				}}
			>
				{h1Content}
			</h1>
			<p
				style={{
					textAlign: "center",
					fontSize: "16px",
					color: "#454245",
				}}
			>
				We've sent an email to you at <b>{censorEmail(user.email)}</b>
			</p>
		</div>
	);
}
