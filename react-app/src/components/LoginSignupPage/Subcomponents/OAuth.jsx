import "./OAuth.css";
import googleIcon from "../../../assets/Google__G__Logo.svg";

export default function OAuth({ isSigningUp, link }) {
	const txt = isSigningUp ? "Continue With Google" : "Sign In With Google";

	return (
		<a href={link} class="google-btn">
			<div class="google-icon-wrapper">
				<img alt="Google Logo" class="google-icon" src={googleIcon} />
			</div>
			<p class="btn-text">
				<b>{txt}</b>
			</p>
		</a>
	);
}
