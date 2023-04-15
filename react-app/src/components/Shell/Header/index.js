import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';

function Header({ isLoaded }) {

	const sessionUser = useSelector(state => state.session.user);

	// const toggleLeftPane = function hideShowLeftPane() {
	// 	if (document.getElementById("grid-leftside-heading").className === "grid-leftside-heading-closed") {
	// 		document.getElementById("grid-leftside-heading").className = "grid-leftside-heading"
	// 		document.getElementById("grid-leftside").className = "grid-leftside";
	// 		document.getElementById("hideshow-leftpane-hamburger").style.display = "none";
	// 		document.getElementById("hideshow-leftpane-arrow").style.display = "block";
	// 	} else {
	// 		document.getElementById("grid-leftside-heading").className = "grid-leftside-heading-closed"
	// 		document.getElementById("grid-leftside").className = "grid-leftside-closed";
	// 		document.getElementById("hideshow-leftpane-hamburger").style.display = "block";
	// 		document.getElementById("hideshow-leftpane-arrow").style.display = "none";
	// 	}
	// }

	return (
		<div className="grid-header">
			<div className="header-holder">
				<div>
					<button id="hideshow-leftpane-hamburger" onClick={() => { window.toggleLeftPane() }}
						className="hideshow-leftpane">
						<i className="fas fa-bars" style={{ fontSize: "18px" }}></i>
					</button>
					<button id="hideshow-leftpane-arrow" onClick={() => { window.toggleLeftPane() }}
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
