import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import userChannelDMSearch from "../../../utils/userChannelDMSearch";
import { useNavigate } from "react-router-dom";
import { AddChannelThunk, UserChannelThunk } from "../../../store/channel";
import toggleRightPane from "./toggleRightPane";
import SelectedUserRightBarContext from "../../../context/SelectedUserRightBar/SelectedUserRightBarContext";
import ActivityStatus from "../../ActivityStatus";

function RightSideInfo() {
	const [selectedUserRightBar] = useContext(SelectedUserRightBarContext);
	const user_channels = useSelector((state) => state.channels.user_channels);
	const currUser = useSelector((state) => state.session.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const onMessageClick = async () => {
		const possibleChannel = userChannelDMSearch(
			user_channels,
			currUser,
			selectedUserRightBar,
		);
		if (possibleChannel) {
			navigate(`/channels/${possibleChannel.id}`);
			toggleRightPane();
		} else {
			const newChan = await dispatch(
				AddChannelThunk({
					name: "",
					subject: "",
					is_private: true,
					is_direct: true,
				}),
			);
			await fetch(
				`/api/channels/${newChan.id}/users/${selectedUserRightBar.id}`,
				{
					method: "POST",
				},
			);
			/*
            There's probably a better way to do this, but for now this is how I'm getting the components that depend on the above fetch to re-render, since it doesn't go through Redux at all.
             */
			await dispatch(UserChannelThunk());
			navigate(`/channels/${newChan.id}`);
			toggleRightPane();
		}
	};

	const activityStyles = {
		textAlign: "left",
		width: "100%",
		marginBottom: "20px",
		display: "block",
	};

	return (
		<div id="grid-rightside" className="grid-rightside-hide">
			<div className="rightside-holder">
				<div
					className="profile-avatar"
					style={{ margin: "20px 20px 10px 20px" }}
				>
					<img
						src={selectedUserRightBar?.avatar}
						alt={`${selectedUserRightBar?.first_name} ${selectedUserRightBar?.last_name}`}
						style={{
							borderRadius: "12px",
							maxWidth: "100%",
							maxHeight: "100%",
							minWidth: "180px",
						}}
					></img>
				</div>

				<div
					style={{
						fontSize: "22px",
						fontWeight: "700",
						marginBottom: "20px",
						textAlign: "left",
						width: "100%",
					}}
				>
					{selectedUserRightBar?.first_name}{" "}
					{selectedUserRightBar?.last_name}
				</div>

				<ActivityStatus
					styles={activityStyles}
					user={selectedUserRightBar}
				/>

				<div style={{ textAlign: "left", width: "100%" }}>
					{selectedUserRightBar?.bio}
					<div style={{ marginTop: "20px" }}>
						<button
							onClick={onMessageClick}
							style={{
								fontSize: "15px",
								fontWeight: "500",
								backgroundColor: "#FFFFFF",
								padding: "5px 8px",
								borderRadius: "5px",
								border: "1px solid grey",
							}}
						>
							<i
								style={{ paddingRight: "5px" }}
								className="far fa-comment"
							></i>
							Message
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default RightSideInfo;
