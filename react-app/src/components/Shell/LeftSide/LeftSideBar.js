import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, NavLink } from "react-router-dom";
import LeftSideBarDMSection from "./LeftSidebarDMSection";
import LeftSidebarAboutMe from "./LeftSidebarAboutMe";
import * as ChlActions from "../../../store/channel";
import OpenModalButton from "../../OpenModalButton";
import CreateChannelModal from "../../CreateFormModal/CreateChannelModal";
import { toggleRightPane } from "../../../utils/togglePaneFunctions";

function LeftSideLinks () {
	const { channelId } = useParams();

	let defaultState = localStorage.getItem("Channel_Section_Hidden");
	if (defaultState) {
		defaultState = defaultState !== "false";
	} else {
		defaultState = false;
	}
	const [isHidden, setIsHidden] = useState(defaultState);
	const caretDisplayMap = {
		false: "down",
		true: "right"
	};
	const toggleIsHidden = () => {
		setIsHidden((val) => {
			const newVal = !val;
			localStorage.setItem("Channel_Section_Hidden", newVal.toString());
			return newVal;
		});
	};

	const dispatch = useDispatch();
	const sessionUser = useSelector(state => state.session.user);
	const userChannels = useSelector((state) => state.channels.user_channels);

	useEffect(() => {
		dispatch(ChlActions.UserChannelThunk());
	}, [dispatch]);

	const userChannelList = Object.values(userChannels);

	const closeRightPane = () => {
		if (document.getElementsByClassName("grid-rightside-heading")[0]) {
			toggleRightPane("close");
		}
	};

	return (
		<div id="grid-leftside" className="grid-leftside-threecolumn">
			<div className="leftside-link-holder">

				<div className="leftside-channeldirect-holder">

					<NavLink onClick={closeRightPane} to={"/channels/explore"}>
						<div>

							{/explore/.test(window.location.href)
								? (
									<button style={{ textDecoration: "none", backgroundColor: "#275895", color: "#e9e8e8" }}>
										<span style={{ width: "20px" }}><i className="fa fa-newspaper-o"></i></span>
										<span className="ellipsis-if-long">Explore Channels</span>
									</button>
								)
								: (
									<button style={{ textDecoration: "none" }}>
										<span style={{ width: "20px" }}><i className="fa fa-newspaper-o"></i></span>
										<span className="ellipsis-if-long">Explore Channels</span>
									</button>
								)}

						</div>
					</NavLink>

					<NavLink
						onClick={closeRightPane}
						to={"/channels/direct"}
					>
						<div>
							{/\/channels\/direct/.test(window.location.href)
								? (
									<button style={{ textDecoration: "none", backgroundColor: "#275895", color: "#e9e8e8" }}>
										<span style={{ width: "20px" }}><i className="far fa-comments"></i></span>
										<span className="ellipsis-if-long">Direct Messages</span>
									</button>
								)
								: (
									<button style={{ textDecoration: "none" }}>
										<span style={{ width: "20px" }}><i className="far fa-comments"></i></span>
										<span className="ellipsis-if-long">Direct Messages</span>
									</button>
								)}
						</div>
					</NavLink>

					<div>
						<OpenModalButton
							modalComponent={
								<CreateChannelModal
									user={sessionUser}
								/>}
							buttonText={"Create a New Channel"}
							className="ellipsis-if-long"
							renderChatIcon={true}
						/>
					</div>
				</div>

			</div>

			<div id="last-leftside-holder" className="leftside-channeldirect-holder">

				{/* <!-- ------ Spacer Div for Between leftside sections------- --> */}
				<div style={{ padding: "4px" }}></div>

				<button
					className="leftside-channeldirect-holder-button"
					onClick={toggleIsHidden}
					style={{ textDecoration: "none", marginLeft: "14px", width: "91%" }} >
					<span
						style={{ width: "20px" }}>
						<i className={`fas fa-caret-${caretDisplayMap[isHidden]}`}>
						</i>
					</span>
					<span
						className="ellipsis-if-long"
						style={{ marginLeft: "-3px" }} >
                            Channels
					</span>
				</button>

				{(userChannelList.length > 0) && userChannelList
					.filter((channel) => !channel.is_direct)
					.map((channel) => {
						return (
							<NavLink
								onClick={closeRightPane}
								hidden={isHidden && channel.id !== +channelId}
								key={channel.id} to={`/channels/${channel.id}`}>
								<div key={channel.id}>
									{Number(channel.id) === Number(channelId)
										? (
											<button style={{ textDecoration: "none", backgroundColor: "#275895", color: "#e9e8e8" }} >
												<span style={{ width: "20px" }}><i className="fas fa-hashtag"></i></span>
												<span className="ellipsis-if-long" >{channel.name}</span>
											</button>
										)
										: (
											<button style={{ textDecoration: "none" }} >
												<span style={{ width: "20px" }}><i className="fas fa-hashtag"></i></span>
												<span className="ellipsis-if-long" >{channel.name}</span>
											</button>
										)}
								</div>
							</NavLink>
						);
					})}

				{/* <!-- ------ Spacer Div for Between leftside sections------- --> */}

				<div style={{ padding: "8px" }}></div>

				<LeftSideBarDMSection
					user={sessionUser}
					channels={userChannelList.filter((channel) => channel.is_direct)}
				/>
			</div>
			<LeftSidebarAboutMe />
		</div>

	);
}

export default LeftSideLinks;
