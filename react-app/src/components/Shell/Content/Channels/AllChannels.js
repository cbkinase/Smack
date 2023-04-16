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
            <h2 style={{paddingLeft: "20px", margin: "20px 20px"}}>Explore Channels on Smack</h2>
            <div>
            {allChannelsArr.map((channel) => (
                <NavLink style={{display: "flex", marginBottom: "10px"}} onClick={async e => {
                    await fetch(`/api/channels/${channel.id}/users`, {
                        method: "POST",

                    })
                    dispatch(ChlActions.UserChannelThunk())
                }} to={`/channels/${channel.id}`}>
                    <div style={{paddingLeft: "40px"}}>{`#${channel.id}`}</div>
                    <div style={{paddingLeft: "20px"}}>{channel.name}</div>
                </NavLink>
            ))}
            </div>
        </>
    );
}

export default AllChannels;
