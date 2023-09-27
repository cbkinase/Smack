import "./OAuth.css";
import googleIcon from "../../../assets/Google__G__Logo.svg";

export default function OAuth({ isSigningUp, link }) {
	const txt = isSigningUp ? "Continue With Google" : "Sign In With Google";

	return (
		<a href={link} className="google-btn">
			<div className="google-icon-wrapper">
				<img
					alt="Google Logo"
					className="google-icon"
					src={googleIcon}
				/>
			</div>
			<p className="btn-text">
				<b>{txt}</b>
			</p>
		</a>
	);
}
