import React from "react";

function Pinned () {
	return (
		<div id="pinned-message-holder" className="pinned-message-holder" style={{ display: "none" }}>
			<button><i style={{ paddingRight: "5px" }} className="far fa-dot-circle"></i> 2 Pinned</button>
		</div>
	);
}

export default Pinned;
