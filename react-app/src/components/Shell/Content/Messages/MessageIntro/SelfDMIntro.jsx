import { useContext } from "react";
import SelectedUserRightBarContext from "../../../../../context/SelectedUserRightBar/SelectedUserRightBarContext";
import { toggleRightPane } from "../../../../../utils/togglePaneFunctions";
import ActivityStatus from "../../../../ActivityStatus";

export default function SelfDMIntro({ user }) {
	const [, setSelectedUserRightBar] = useContext(SelectedUserRightBarContext);

	const handleNameClick = (member) => {
		setSelectedUserRightBar(member);
		toggleRightPane();
	};

	const introTitle = (
		<div className="dm-intro-title-container">
			<img alt="" className="dm-intro-picture" src={user.avatar}></img>
			<h3 onClick={() => handleNameClick(user)} id="dm-intro-title">
				{user.first_name} {user.last_name} (you)
			</h3>
			<ActivityStatus
				user={user}
				iconOnly={true}
				styles={{ paddingTop: "5px" }}
			/>
		</div>
	);

	const channelIntroAbout = (
		<p
			style={{
				paddingTop: "13px",
				marginBottom: "-25px", // Get rid of this if we add back buttons
			}}
		>
			<span style={{ fontWeight: "bold" }}>This is your space.</span>{" "}
			Draft messages, list your to-dos, or keep links and files handy. You
			can also talk to yourself here, but please bear in mind you’ll have
			to supply both sides of the conversation.
		</p>
	);

	const channelIntroBtn = null;

	return (
		<div className="channel-intro-container">
			{introTitle}
			<div className="channel-intro-about">{channelIntroAbout}</div>
			{channelIntroBtn}
		</div>
	);
}
