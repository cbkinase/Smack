import { useModal } from "../../context/Modal/Modal";
import { useState, useContext } from "react";
import OpenModalButton from "../OpenModalButton";
import ChannelMembersAll from "./ChannelMembersAll";
import isSelfDM from "../../utils/isSelfDM";
import SelectedUserRightBarContext from "../../context/SelectedUserRightBar/SelectedUserRightBarContext";
import { toggleRightPane } from "../../utils/togglePaneFunctions";
import ChannelMember from "./Subcomponents/ChannelMember";
import MemberModalHeader from "./Subcomponents/MemberModalHeader";
import "./ChannelMembersModal.css";

export default function ChannelMembersModal ({ currentChannel, numMemb, userList, user }) {
	const [, setSelectedUserRightBar] = useContext(SelectedUserRightBarContext);
	const [searchTerm, setSearchTerm] = useState("");
	const { closeModal } = useModal();

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	const filteredMembers = userList.filter((member) => {
		const fullName = member.first_name.toLowerCase() + " " + member.last_name.toLowerCase();
		return fullName.includes(searchTerm.toLowerCase());
	});

	function onMemberClick (member) {
		setSelectedUserRightBar(member);
		toggleRightPane();
		closeModal();
	}

	const AddMembersButton = !isSelfDM(currentChannel, user) && (
		<div style={{ display: "flex", justifyContent: "center", marginTop: "12px" }}>
			<OpenModalButton
				className="login-input-submit-alt"
				modalComponent={
					<ChannelMembersAll
						currentChannel={currentChannel}
						numMemb={numMemb}
						userList={userList}
						user={user}
					/>}
				buttonText="Add members"
			/>
		</div>
	);

	return <>
		<div className="channel-member-modal-container">

			<MemberModalHeader user={user} channel={currentChannel} />

			<input
				id="channel-search"
				type="text"
				placeholder="Find members"
				value={searchTerm}
				onChange={handleSearchChange}
			/>

			<div className="channels-list">
				{filteredMembers.map((member) =>
					<ChannelMember key={member.id} member={member} onClickFn={onMemberClick} />)}
				{AddMembersButton}
			</div>

		</div>
	</>;
}
