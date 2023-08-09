import React from "react";
import AddReactionButton from "./AddReactionButton";
import DeleteMessageButton from "./DeleteMessageButton"
import EditMessageButton from "./EditMessageButton";

export default function MessageUtils({ message, user, socket, dispatch, changeAdjustText, channelId, editing }) {

    return (
        <div className="message-card-makechangebox">

            <span
                id={`message-adjust-text-${message.id}`}
                className="message-adjust-text"
            ></span>

            {user.id === message.user_id && (
                <AddReactionButton message={message}
                                    user={user}
                                    socket={socket}
                                    dispatch={dispatch}
                                    changeAdjustText={changeAdjustText}
                />
            )}

            {/* GOING TO FIX EDITMESSAGE TO DRILL LESS PROPS */}

            {user.id === message.user_id && (
                <EditMessageButton message={message}
                                    user={user}
                                    dispatch={dispatch}
                                    socket={socket}
                                    changeAdjustText={changeAdjustText}
                                    channelId={channelId}
                                    editing={editing}
                />
            )}

            {user.id === message.user_id && (
                <DeleteMessageButton message={message}
                                        user={user}
                                        socket={socket}
                                        dispatch={dispatch}
                                        changeAdjustText={changeAdjustText}
                />
            ) }
            



        </div>

    )
}