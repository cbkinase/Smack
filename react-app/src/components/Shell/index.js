import React, { useContext } from "react";
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
import { useEffect } from "react";
import RouteIdContext from "../../context/RouteId/RouteIdContext";

function Shell({ isLoaded }) {
    const dispatch = useDispatch();
    const socket = useSelector(state => state.session.socket);
    const [routeId, _] = useContext(RouteIdContext);

    useEffect(() => {

        if (!socket) return;

        socket.on("new_DM_convo", (convoId) => {
            // Refresh the left sidebar info on receive
            dispatch(UserChannelThunk());
            // Refresh channel header info on receive
            // ONLY if convoId === routeId
            if (+routeId === +convoId)
                dispatch(OneChannelThunk(convoId));

            /*

            It's worth noting that we only need to do some of this stuff because we don't really (consistently) include channel member info in the store.

            There is almost certainly a better way to do this than performing additional queries, but it's an OK band-aid solution for now.

            */
           return () => {
            socket.off("new_DM_convo");
           }
        });
    }, [socket, dispatch, routeId])

    return (
        <div id="grid-container" className="grid-container-hiderightside">
            <Header isLoaded={isLoaded} />

            <Switch>
                <Route exact path="/">
                    <LeftSide />
                    <RightSide />
                    <AllChannels />
                </Route>
                <Route exact path="/channels/explore">
                    <LeftSide />
                    <RightSide />
                    <AllChannels />
                </Route>
                <Route exact path="/channels/new">
                    <LeftSide />
                    <RightSide />
                    <CreateChannel />
                </Route>
                <Route exact path="/channels/direct">
                    <LeftSide />
                    <RightSide />
                    <DMChannels />
                </Route>

                <Route path="/channels/:channelId">
                    <LeftSide />
                    <RightSide />
                    <Content />
                </Route>

            </Switch>

        </div>
    );
}

export default Shell;
