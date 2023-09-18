import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import LeftSideHeader from "./LeftSideHeader";
import LeftSideLinks from "./LeftSideBar";
import RouteIdContext from "../../../context/RouteId/RouteIdContext";

function LeftSide() {
	const [, setRouteId] = useContext(RouteIdContext);
	const { channelId } = useParams();

	useEffect(() => {
		setRouteId(channelId);
	}, [channelId, setRouteId]);

	return (
		<>
			<LeftSideHeader />
			<LeftSideLinks />
		</>
	);
}

export default LeftSide;
