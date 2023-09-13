import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "./Header";
import LeftSide from "./LeftSide";
import Content from "./Content";
import RightSide from "./RightSide/RightSide";
import { Route, Routes, Navigate } from "react-router-dom";
import CreateChannel from "./Content/Channels/ChannelCreator";
import AllChannels from "./Content/Channels/AllChannels";
import DMChannels from "./Content/Channels/DMChannels";
import { UserChannelThunk, OneChannelThunk } from "../../store/channel";
import {
    disconnectWebSocket,
    setOnlineUsers,
    removeOnlineUser,
    addOnlineUser
} from "../../store/session";
import { useEffect } from "react";
import RouteIdContext from "../../context/RouteId/RouteIdContext";

function Shell({ isLoaded }) {
    const dispatch = useDispatch();
    const socket = useSelector(state => state.session.socket);
    const user = useSelector(state => state.session.user);
    const [routeId,] = useContext(RouteIdContext);

    useEffect(() => {
        // Disconnect the socket as the window is closing
        const handleDisconnection = () => {
            socket.emit("stopped_typing", { "channel_id": routeId, user_id: user.id });
            dispatch(disconnectWebSocket());
        };

        // Add the event listener
        window.addEventListener('beforeunload', handleDisconnection);

        // Cleanup the event listener on Shell unmount
        return () => {
            window.removeEventListener('beforeunload', handleDisconnection);
        };
    }, [dispatch, routeId, user, socket]);

    useEffect(() => {

        if (!socket) return;

        socket.on("new_DM_convo", (convoId) => {
            // Refresh the left sidebar info on receive
            dispatch(UserChannelThunk());
            // Refresh channel header info on receive
            // ONLY if convoId === routeId
            if (+routeId === +convoId)
                dispatch(OneChannelThunk(convoId));
        })
            /*
            There is almost certainly a better way to do this than performing additional queries, but it's an OK band-aid solution for now.
            */
            return () => {
                socket.off("new_DM_convo");
            }
        }, [socket, dispatch, routeId, user]);

    useEffect(() => {
        if (!socket) return;

        socket.on("after_connecting", (onlineUsers) => {
            dispatch(setOnlineUsers(onlineUsers));
        })

        socket.on("user_online", (id) => {
            dispatch(addOnlineUser(id));
        })

        socket.on("user_offline", (id) => {
            dispatch(removeOnlineUser(id));
        })

        return () => {
            socket.off("user_offline");
            socket.off("user_online");
            socket.off("after_connecting");
        }
    }, [dispatch, socket])

    return (
        <div id="grid-container" className="grid-container-hiderightside">
            <Header isLoaded={isLoaded} />
            <Routes>
                <Route path="/" element={<>
                    <LeftSide />
                    <RightSide />
                    <AllChannels />
                </>} />
                <Route path="/channels/explore" element={<>
                    <LeftSide />
                    <RightSide />
                    <AllChannels />
                </>} />
                <Route path="/channels/new" element={<>
                    <LeftSide />
                    <RightSide />
                    <CreateChannel />
                </>} />
                <Route path="/channels/direct" element={<>
                    <LeftSide />
                    <RightSide />
                    <DMChannels />
                </>} />
                <Route path="/channels/:channelId" element={<>
                    <LeftSide />
                    <RightSide />
                    <Content />
                </>} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default Shell;
