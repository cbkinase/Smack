import React from "react";
import toggleRightPane from "./toggleRightPane";

export default function RightSideHeader () {
	return (
		<div id="grid-rightside-heading" className="grid-rightside-heading-hide">
			<div className="rightside-heading-holder">
				<div>Profile</div>
				<div>
					<button className="rightside-close-btn" onClick={() => { toggleRightPane(); }}>
						<i className="fa-solid fa-x"></i>
					</button>
				</div>
			</div>
		</div>
	);
}
