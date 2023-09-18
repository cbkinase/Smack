import React from "react";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import { hideShowLeftPane } from "../../../utils/togglePaneFunctions";

function Header ({ isLoaded }) {
	const sessionUser = useSelector(state => state.session.user);

	return (
		<div className="grid-header">
			<div className="header-holder">
				<div>
					<button id="hideshow-leftpane-hamburger" onClick={hideShowLeftPane}
						className="hideshow-leftpane">
						<i className="fas fa-bars" style={{ fontSize: "18px" }}></i>
					</button>
					<button id="hideshow-leftpane-arrow" onClick={hideShowLeftPane}
						className="hideshow-leftpane">
						<i className="fas fa-arrow-left" style={{ fontSize: "18px" }}></i>
					</button>
				</div>
				<ul>
					{/* <li style={{ color: 'white' }}>
						<NavLink exact to="/"><span style={{ color: 'white' }}>Home</span></NavLink>
					</li> */}
					{isLoaded && (
						<li>
							<ProfileButton user={sessionUser} />
						</li>
					)}
				</ul>
			</div>
		</div>
	);
}

export default Header;
