import blackSmackLogo from "../LoginSignupPage/smack-logo-black.svg";
import "./LoadingLogo.css";

export default function LoadingLogo ({ offset }) {
	return (
		<div className={offset ? "spinner-load-container-offset" : "spinner-load-container"}>
			<img className="breathe" style={{ maxWidth: "200px" }} src={blackSmackLogo}></img>
		</div>
	);
}
