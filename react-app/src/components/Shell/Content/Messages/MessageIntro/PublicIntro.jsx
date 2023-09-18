import { useContext } from "react";
import { toggleRightPane } from "../../../../../utils/togglePaneFunctions";
import formatLongDate from "../../../../../utils/formatLongDate";
import determineChannelName from "../../../../../utils/determineChannelName";
import OpenModalButton from "../../../../OpenModalButton";
import ChannelMembersAll from "../../../../ChannelMembersModal/ChannelMembersAll";
import SelectedUserRightBarContext from "../../../../../context/SelectedUserRightBar/SelectedUserRightBarContext";
import EditChannelModal from "../../../../EditFormModal/EditChannelModal";

export default function PublicIntro({ channel, user }) {
	const owner = channel.Members[channel.owner_id];
	const formattedDate = formatLongDate(channel.created_at, true);
	const channelName = determineChannelName(channel, user);

	const addPeopleBtn = (
		<OpenModalButton
			className="channel-intro-btn"
			renderPersonPlus={true}
			modalComponent={
				<ChannelMembersAll
					currentChannel={channel}
					userList={Object.values(channel.Members)}
					user={user}
				/>
			}
			buttonText="Add people"
		/>
	);

	const editChannelBtn = (
		<OpenModalButton
			className="channel-intro-btn"
			renderPencil={true}
			modalComponent={
				<EditChannelModal
					channelId={channel.id}
					user={user}
					currChannel={channel}
				/>
			}
			buttonText="Edit channel"
		/>
	);

	const [, setSelectedUserRightBar] = useContext(SelectedUserRightBarContext);

	const handleNameClick = () => {
		setSelectedUserRightBar(owner);
		toggleRightPane();
	};

	return (
		<div className="channel-intro-container">
			<h3 id="channel-intro-title" className="ellipsis-if-long">
				{channelName}
			</h3>

			<p className="channel-intro-about">
				<span id="intro-owner-name" onClick={handleNameClick}>
					{owner.first_name} {owner.last_name}
				</span>{" "}
				created this channel on {formattedDate}. This is the very
				beginning of the{" "}
				<span id="channel-intro-sub">{channelName}</span> channel.
				{channel.subject && (
					<span id="channel-intro-description">
						Description: {channel.subject}
					</span>
				)}
			</p>

			{channel.owner_id === user.id && editChannelBtn}
			{addPeopleBtn}
		</div>
	);
}
