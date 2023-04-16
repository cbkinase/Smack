import React from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import LeftSide from "./LeftSide";
import Content from "./Content";
import RightSide from "./RightSide/RightSide";
import { Route, Switch } from "react-router-dom";
import CynChannel from "./ChannelTestCyn/ChannelTest";
import CreateChannel from "./Content/Channels/ChannelCreator";
import AllChannels from "./Content/Channels/AllChannels";
import { useState, useEffect } from "react";

function Shell({ isLoaded }) {




    const [selectedUserRightBar, setSelectedUserRightBar] = useState();
    return (
        <div id="grid-container" className="grid-container-hiderightside">
            <Header isLoaded={isLoaded} />
            <LeftSide />
            <RightSide selectedUserRightBar={selectedUserRightBar} setSelectedUserRightBar={setSelectedUserRightBar} />
            <Switch>
                <Route exact path="/channels/explore">
                    <AllChannels />
                </Route>
                <Route exact path="/channels/new">
                    <CreateChannel />
                </Route>
                <Route exact path="/channels/direct">
                    <h1>Feature Coming Soon...</h1>
                </Route>

                <Route path="/channels/:channelId">
                    <Content selectedUserRightBar={selectedUserRightBar} setSelectedUserRightBar={setSelectedUserRightBar} />
                </Route>

                {/* <Route path = "/chl-test">
                    <CynChannel />
                </Route> */}
            </Switch>

        </div>
    );
}

export default Shell;
