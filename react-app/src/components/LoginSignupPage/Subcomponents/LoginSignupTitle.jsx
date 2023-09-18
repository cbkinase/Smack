import signinupLogo from "../smack-logo-black.svg";
import { NavLink } from "react-router-dom";

export default function LoginSignupTitle({ handleLogoClick, formTitle }) {
	return (
		<>
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
				ref={formTitle}
				style={{
					textAlign: "center",
					fontSize: "48px",
					fontWeight: "700",
					paddingTop: "30px",
					paddingBottom: "14px",
				}}
			>
				Sign in to Smack
			</h1>
		</>
	);
}
