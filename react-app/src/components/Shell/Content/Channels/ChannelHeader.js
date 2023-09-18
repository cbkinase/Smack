import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import * as ChlActions from "../../../../store/channel";
import OpenModalButton from "../../../OpenModalButton";
import EditChannelModal from "../../../EditFormModal/EditChannelModal";
import ChannelMembersModal from "../../../ChannelMembersModal";
import determineChannelName from "../../../../utils/determineChannelName";

function ChannelHeader () {
	const user = useSelector(state => state.session.user);

	const { channelId } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const singleChannel = useSelector((state) => state.channels.single_channel);

	useEffect(() => {
		dispatch(ChlActions.OneChannelThunk(channelId))
			.then(res => {
				if (res.error) {
					navigate("/channels/explore");
					return;
				}
				const channel = res.single_channel;
				document.title = `${determineChannelName(res.single_channel, user)} - Smack`;

				if (!channel.is_direct) {
					document.title = `${document.title.slice(1)}`;
				}
			});
		return () => {
			document.title = "Smack";
		};
	}, [dispatch, channelId, navigate, user]);

	const currentChannel = singleChannel;

	if (!currentChannel) return null;

	const userList = Object.values(currentChannel.Members);
	const numMemb = userList.length;

	return (

		<div className="content-heading-holder">
			<div className="content-header-left">
				<OpenModalButton
					renderDownArrow={true}
					modalComponent={
						<EditChannelModal
							channelId={channelId}
							user={user}
							currChannel={currentChannel}/>}

					buttonText={currentChannel ? determineChannelName(currentChannel, user) : ""}
					className="content-header-channelname"
				/>
				<div className="content-header-channeltopic hide-if-small">
					<p style={{ maxWidth: "28vw" }} className="ellipsis-if-long">{currentChannel ? currentChannel.subject : ""}</p>
				</div>
			</div>
			<OpenModalButton
				modalComponent={
					<ChannelMembersModal
						currentChannel={currentChannel}
						numMemb={numMemb}
						userList={userList}
						user={user}>
					</ChannelMembersModal>}
				className="content-header-right"
				userList={userList}
				numMemb={numMemb}
				currUser={user}>
			</OpenModalButton>
		</div>

	);
}

export default ChannelHeader;
