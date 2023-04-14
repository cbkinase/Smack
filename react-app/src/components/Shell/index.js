import React from 'react';
import { useSelector } from "react-redux";
import Header from './Header';
import LeftSide from './LeftSide'
import Content from './Content';
import RightSide from './RightSide/RightSide';
import { Route, Switch} from 'react-router-dom';
import CynChannel from './ChannelTestCyn/ChannelTest'


function Shell({ isLoaded }) {
    return (
        <div id="grid-container" className="grid-container-hiderightside">
            <Header isLoaded={isLoaded} />
            <LeftSide />
            <Switch>
                <Route exact path="/channels/explore">
                    <h1>All Channels here </h1>
                </Route>
                <Route exact path="/channels/direct">
                    <h1>Feature Coming Soon...</h1>
                </Route>
                <Route path = "/channels/:channelId">
                    <Content />
                </Route>
                
                {/* <Route path = "/chl-test">
                    <CynChannel />
                </Route> */}
            </Switch>
            
            <RightSide />

        </div>

    );
}

export default Shell;
