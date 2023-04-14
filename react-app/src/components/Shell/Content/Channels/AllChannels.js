import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as ChlActions from "../../../../store/channel";
import { NavLink } from "react-router-dom";

function AllChannels() {
    const dispatch = useDispatch();
    const allChannels = useSelector((state) => state.channels.all_channels);

    useEffect(() => {
        dispatch(ChlActions.AllChannelThunk());
    }, [dispatch]);

    const allChannelsArr = Object.values(allChannels);

    return (
        <>
            <h2>ALL CHANNELS:</h2>
            {allChannelsArr.map((channel) => (
                <NavLink to={`/channels/${channel.id}`}>
                    <div>{`${channel.id} ${channel.name}`}</div>
                    <div>{channel.subject}</div>
                </NavLink>
            ))}
        </>
    );
}

export default AllChannels;
