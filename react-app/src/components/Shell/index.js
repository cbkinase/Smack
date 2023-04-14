import React from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import LeftSide from "./LeftSide";
import Content from "./Content";
import RightSide from "./RightSide/RightSide";
import { Route, Switch } from "react-router-dom";

function Shell({ isLoaded }) {
    return (
        <div id="grid-container" className="grid-container-hiderightside">
            <Header isLoaded={isLoaded} />
            <LeftSide />
            <Switch>
                <Route path="/channels/:channelId">
                    <Content />
                </Route>
            </Switch>

            <RightSide />
        </div>
    );
}

export default Shell;
