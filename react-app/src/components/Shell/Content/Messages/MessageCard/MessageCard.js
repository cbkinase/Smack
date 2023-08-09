import React, { useState, useEffect, useRef, Fragment, useContext } from "react";
import toggleRightPane from "../../../RightSide/toggleRightPane";
import SelectedUserRightBarContext from "../../../../../context/SelectedUserRightBar/SelectedUserRightBarContext";

import OpenModalButton from "../../../../OpenModalButton";
import ReactionModal from "../../../../ReactionModal";
import DeleteMessageModal from "../../../../DeleteMessageModal"
import AttachmentCard from "../Attachments/AttachmentCard";

import MessageAvatar from "./MessageParts/MessageAvatar";
import MessageHeader from "./MessageParts/MessageHeader";
let updatedMessage;


function MessageCard({message, user, socket, dispatch, messageFunctions}) {
    

    const { editMessage,
            channelId,
            handleDeleteAttachment, 
            storeConverter } = messageFunctions;

    const [, setSelectedUserRightBar] = useContext(SelectedUserRightBarContext);
    

    // hover functionality for attachments
    const [hoverId, setHoverId] = useState(0);

    // TO CHANGE TO STATE VARIABLE
    let editing = false;

    function changeAdjustText(text, id) {
        document.getElementById(`message-adjust-text-${id}`).textContent = text;
    }

    

    return (
        <div className="message-card"
            key={message.id}
            id={`message-${message.id}`}
        >

            <MessageAvatar messageUser={message.User}
                         user={user}
                         setSelectedUserRightBar={setSelectedUserRightBar}
            />

            <div className="message-card-content">

                <MessageHeader message={message}
                                user={user} 
                                socket={socket}
                                dispatch={dispatch} 
                                changeAdjustText={changeAdjustText}
                                channelId={channelId}
                                editing={editing}
                
                />

                <div style={{ overflowWrap: "anywhere" }} id={`msg-content-${message.id}`}>
                    {message.content} {message.updated_at !== message.created_at && <span style={{ color: "#888888", paddingLeft: '2px', fontSize: '13px' }}>(edited)</span>}
                </div>
                
                {Object.values(message.Attachments).length ?

                    <AttachmentCard attachments={message.Attachments}
                                    messageId={message.id}
                                    user={user}
                                    handleDeleteAttachment={handleDeleteAttachment}
                                    hoverId={hoverId}
                                    setHoverId={setHoverId}
                    />

                    : null
                }

                <div style={{}} className="message-card-footer">
                    {storeConverter(message, user)}
                </div>

            </div>


        </div>
    )
}

export default MessageCard;
