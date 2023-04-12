import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';

function Header({ isLoaded }) {
	const sessionUser = useSelector(state => state.session.user);

	return (
		<div className="grid-header">
			<div className="header-holder">
				<div>
					<button id="hideshow-leftpane-hamburger" onclick="hideShowLeftPane();"
						class="hideshow-leftpane">
						<i class="fas fa-bars" style={{ fontSize: "18px" }}></i>
					</button>
					<button id="hideshow-leftpane-arrow" onclick="hideShowLeftPane();"
						class="hideshow-leftpane">
						<i class="fas fa-arrow-left" style={{ fontSize: "18px" }}></i>
					</button>
				</div>
				<ul>
					<li style={{ color: 'white' }}>
						<NavLink exact to="/"><span style={{ color: 'white' }}>Home</span></NavLink>
					</li>
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
