import smackLogo from "../../Shell/LeftSide/smack-logo-white.svg";
import "./Nav.css";
import { NavLink } from "react-router-dom";

export default function Nav () {
	return (
		<nav className="landing-nav">
			<div className="landing-nav-content">
				<img src={smackLogo} alt="smack logo"></img>
				<NavLink to='/login'>Log In</NavLink>

			</div>
		</nav>
	);
}
