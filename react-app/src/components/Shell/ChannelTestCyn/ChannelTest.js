import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as ChlActions from "../../../store/channel"


function CynChannel() {
    const dispatch = useDispatch();
    const allChannels = useSelector((state) => state.channels.all_channels)
    const userChannels = useSelector((state) => state.channels.user_channels)
    const singleChannel = useSelector((state) => state.channels.single_channel)


    useEffect(() => {
        dispatch(ChlActions.AllChannelThunk());
        dispatch(ChlActions.UserChannelThunk());
        dispatch(ChlActions.OneChannelThunk(2));

    }, [dispatch])


    const allChannelsArr = Object.values(allChannels);
    const userChannelsArr = Object.values(userChannels);
    console.log(singleChannel)
    console.log(Object.values(singleChannel))


    return (
        <>
            <h1>Welcome to Channels Test</h1>
            <h2>ALL CHANNELS:</h2>
            {allChannelsArr.map((channel) => (
                <div>
                    <div>{`${channel.id} ${channel.name}`}</div>
                    <div>{channel.subject}</div>
                </div>
            ))}
            <h2>ALL USER CHANNELS:</h2>
            {userChannelsArr.map((channel) => (
                <div>
                    <div>{`${channel.id} ${channel.name}`}</div>
                    <div>{channel.subject}</div>
                </div>
            ))}


        </>
    );
}

export default CynChannel;