import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as ChlActions from "../../../../store/channel";
import { NavLink, useNavigate } from "react-router-dom";
import "./ViewAllChannels.css";
import useViewportWidth from "../../../../hooks/useViewportWidth";
import { adjustLeftPane } from "../../../../utils/togglePaneFunctions";
import isUserInChannel from "../../../../utils/isUserInChannel";
import Pagination from "../../../Pagination";
import useQuery from "../../../../hooks/useQuery";

function PublicChannelCard({ user, channel, onChannelClick }) {
	const usersInChannel = Object.values(channel.Members).length;
	const usersToPrint = usersInChannel >= 50 ? "50+" : usersInChannel;
	return (
		<NavLink
			key={channel.id}
			className="channels-list-item"
			onClick={() => onChannelClick(user, channel)}
			to={`/channels/${channel.id}`}
		>
			<div style={{ paddingLeft: "10px" }}># {channel.name}</div>
			<p style={{ paddingLeft: "10px", color: "grey", fontSize: "12px" }}>
				{usersToPrint} Member{usersToPrint !== 1 ? "s" : ""}{" "}
				<span style={{ paddingLeft: "3px", paddingRight: "3px" }}>
					·
				</span>{" "}
				{channel.subject}
			</p>
		</NavLink>
	);
}

function AllChannels() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const query = useQuery();
	const viewportWidth = useViewportWidth();
	const allChannels = useSelector((state) => state.channels.all_channels);
	const user = useSelector((state) => state.session.user);
	const totalPages = useSelector(
		(state) => state.channels.pagination.all_channels,
	);
	const [searchTerm, setSearchTerm] = useState("");
	const pageQuery = Number(query.get("page")) || 1;
	const [page, setPage] = useState(pageQuery);
	const [perPage, ] = useState(10);

	useEffect(() => {
		navigate(`?page=${page}`);
	}, [page, navigate]);

	useEffect(() => {
		setPage(pageQuery);
	}, [pageQuery]);

	useEffect(() => {
		if (viewportWidth >= 768) {
			adjustLeftPane("open");
		} else {
			adjustLeftPane("close");
		}
	}, [viewportWidth]);

	useEffect(() => {
		dispatch(ChlActions.AllChannelThunk(page, perPage));
	}, [dispatch, page, perPage]);

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	const allChannelsArr = Object.values(allChannels);

	const filteredChannels = allChannelsArr.filter((channel) => {
		return channel.name.toLowerCase().includes(searchTerm.toLowerCase());
	});

	const onChannelClick = async (user, channel) => {
		if (isUserInChannel(user, channel)) {
			return;
		}
		await fetch(`/api/channels/${channel.id}/users`, {
			method: "POST",
		});
		dispatch(ChlActions.ShortUserChannelThunk());
	};

	return (
		<>
			<div className="view-all-channels">
				<div className="channels-header">
					<h2>Public Channels on Smack</h2>
				</div>
				<input
					id="channel-search"
					type="text"
					placeholder="Search by channel name"
					value={searchTerm}
					onChange={handleSearchChange}
				/>
				<div className="channels-list">
					{allChannelsArr.length > 0 &&
						filteredChannels.map((channel) => (
							<PublicChannelCard
								key={channel.id}
								user={user}
								channel={channel}
								onChannelClick={onChannelClick}
							/>
						))}
				</div>
				<div className="channels-pagination">
					<Pagination
						currentPage={page}
						onPageChange={setPage}
						totalPages={totalPages}
					/>
				</div>
			</div>
		</>
	);
}

export default AllChannels;
