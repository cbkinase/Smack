import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as ChlActions from "../../../../store/channel";
import { NavLink, useNavigate } from "react-router-dom";
import "./ViewAllChannels.css";
import determineChannelName from "../../../../utils/determineChannelName";
import { adjustLeftPane } from "../../../../utils/togglePaneFunctions";
import useViewportWidth from "../../../../hooks/useViewportWidth";
import Pagination from "../../../Pagination";
import useQuery from "../../../../hooks/useQuery";

function DMChannels() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const query = useQuery();
	const viewportWidth = useViewportWidth();
	const user = useSelector((state) => state.session.user);
	const allChannels = useSelector((state) => state.channels.all_channels);
	const totalPages = useSelector(
		(state) => state.channels.pagination.all_channels,
	);
	const [searchTerm, setSearchTerm] = useState("");
	const pageQuery = Number(query.get("page")) || 1;
	const [page, setPage] = useState(pageQuery);
	const [perPage, ] = useState(13);

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
		dispatch(ChlActions.AllChannelThunk(page, perPage, true));
	}, [dispatch, page, perPage]);

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	const allChannelsArr = Object.values(allChannels);

	const filteredChannels = allChannelsArr.filter((channel) => {
		return determineChannelName(channel, user)
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
	});

	return (
		<>
			<div className="view-all-channels">
				<div className="channels-header">
					<h2>Your Direct Messages on Smack</h2>
				</div>
				<input
					id="channel-search"
					type="text"
					placeholder="Search by users"
					value={searchTerm}
					onChange={handleSearchChange}
				/>
				<div className="channels-list">
					{allChannelsArr.length > 0 &&
						filteredChannels.map((channel, index) => {
							return (
								<NavLink
									key={index}
									className="channels-list-item"
									to={`/channels/${channel.id}`}
								>
									<div style={{ paddingLeft: "10px" }}>
										{determineChannelName(channel, user)}
									</div>
								</NavLink>
							);
						})}
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

export default DMChannels;
