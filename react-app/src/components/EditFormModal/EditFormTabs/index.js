import React from "react";
// import { useState } from "react";

const EditChannelTabs = () => {
	// const [activeTab, setActiveTab] = useState("tab1");

	return (
		<div className="Tabs">
			{/* Tab nav */}
			<ul className="nav">
				<li>Tab 1</li>
				<li>Tab 2</li>
			</ul>
			<div className="outlet">{/* content will be shown here */}</div>
		</div>
	);
};

export default EditChannelTabs;
