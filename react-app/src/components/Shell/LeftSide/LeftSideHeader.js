import React from "react";
import logo from "./smack-logo-white.svg";

function LeftSideHeader() {
	return (
		<div
			id="grid-leftside-heading"
			className="grid-leftside-heading-threecolumn"
		>
			<div className="leftside-heading-holder">
				<img
					src={`${logo}`}
					alt="Smack"
					style={{
						width: "127px",
					}}
				></img>
			</div>
		</div>
	);
}

export default LeftSideHeader;
