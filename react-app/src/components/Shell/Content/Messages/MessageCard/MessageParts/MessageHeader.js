import React from "react";
import MessageUsername from "./MessageUsername";
import MessageUtils from "./MessageUtils/MessageUtils";

export default function MessageHeader({
    message, user, socket, dispatch,
    channelId, editing
}) {

    return (
        <div className="message-card-header">

            <MessageUsername messageUser={message.User}
                             messageUpdatedAt={message.updated_at}
                             user={user}
            />

            <MessageUtils message={message}
                          user={user}
                          socket={socket}
                          dispatch={dispatch}
                          channelId={channelId}
                          editing={editing}
            />

        </div>
    )

}
