import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "./Header";
import LeftSide from "./LeftSide";
import Content from "./Content";
import RightSide from "./RightSide/RightSide";
import { Route, Switch } from "react-router-dom";
import CreateChannel from "./Content/Channels/ChannelCreator";
import AllChannels from "./Content/Channels/AllChannels";
import DMChannels from "./Content/Channels/DMChannels";
import { UserChannelThunk, OneChannelThunk } from "../../store/channel";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
let socket;

function Shell({ isLoaded }) {
    const dispatch = useDispatch();

    useEffect(() => {
        socket = io();

        socket.on("new_DM_convo", (convoId) => {
            // Refresh the left sidebar info on receive
            dispatch(UserChannelThunk());
            // Refresh channel header info on receive
            dispatch(OneChannelThunk(convoId))
        })

        return () => {
            socket.disconnect();
        };
    }, [])




    const [selectedUserRightBar, setSelectedUserRightBar] = useState();
    return (
        <div id="grid-container" className="grid-container-hiderightside">
            <Header isLoaded={isLoaded} />

            <Switch>
                <Route exact path="/">
                    <LeftSide />
                    <RightSide selectedUserRightBar={selectedUserRightBar} setSelectedUserRightBar={setSelectedUserRightBar} />
                    <AllChannels />
                </Route>
                <Route exact path="/channels/explore">
                    <LeftSide />
                    <RightSide selectedUserRightBar={selectedUserRightBar} setSelectedUserRightBar={setSelectedUserRightBar} />
                    <AllChannels />
                </Route>
                <Route exact path="/channels/new">
                    <LeftSide />
                    <RightSide selectedUserRightBar={selectedUserRightBar} setSelectedUserRightBar={setSelectedUserRightBar} />
                    <CreateChannel />
                </Route>
                <Route exact path="/channels/direct">
                    <LeftSide />
                    <RightSide selectedUserRightBar={selectedUserRightBar} setSelectedUserRightBar={setSelectedUserRightBar} />
                    <DMChannels />
                </Route>

                <Route path="/channels/:channelId">
                    <LeftSide />
                    <RightSide selectedUserRightBar={selectedUserRightBar} setSelectedUserRightBar={setSelectedUserRightBar} />
                    <Content selectedUserRightBar={selectedUserRightBar} setSelectedUserRightBar={setSelectedUserRightBar} />
                </Route>

            </Switch>

        </div>
    );
}

export default Shell;
