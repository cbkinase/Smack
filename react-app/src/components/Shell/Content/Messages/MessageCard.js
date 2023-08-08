import React, { useState, useEffect, useRef, Fragment, useContext } from "react";
import toggleRightPane from "../../RightSide/toggleRightPane";
import SelectedUserRightBarContext from "../../../../context/SelectedUserRightBar/SelectedUserRightBarContext";




import OpenModalButton from "../../../OpenModalButton";
import ReactionModal from "../../../ReactionModal";
import DeleteMessageModal from "../../../DeleteMessageModal"
import AttachmentCard from "./Attachments/AttachmentCard";

let updatedMessage;


function MessageCard({message, user, socket, dispatch, messageFunctions}) {
    

    const { editMessage,
            channelId,
            handleDeleteAttachment, 
            storeConverter } = messageFunctions;

    const [, setSelectedUserRightBar] = useContext(SelectedUserRightBarContext);
    let editing = false;
    // hover functionality for attachments
    const [hoverId, setHoverId] = useState(0);

    function changeAdjustText(text, id) {
        document.getElementById(`message-adjust-text-${id}`).textContent = text;
    }

    const handleEdit = async (e, msg) => {
        document.getElementById("edit-msg-form").remove();
        e.preventDefault();
        await dispatch(
            editMessage(
                {
                    content: updatedMessage,
                    user_id: user.id,
                    channel_id: channelId,
                    is_pinned: false,
                },
                msg.id
            )
        );

        socket.emit("edit", {
            user: user.username,
            msg: updatedMessage,
            msg_id: msg.id,
        });
    };

    const updateEditMessageInput = (e) => {
        updatedMessage = e.target.value;
    };
    const editMode = (e, msg) => {
        let content = document.getElementById(`msg-content-${msg.id}`);

        let editForm = document.createElement("form");
        editForm.id = "edit-msg-form";

        editForm.onsubmit = (e) => handleEdit(e, msg);

        let editInputBox = document.createElement("textarea");
        editInputBox.onchange = updateEditMessageInput;

        editInputBox.value = msg.content;
        editInputBox.style.backgroundColor = "#FFFFFF";
        editInputBox.style.padding = "5px 10px";
        editInputBox.style.marginTop = "5px";
        editInputBox.style.resize = "none";
        editInputBox.style.border = "1px solid #dddddd";
        editInputBox.style.borderRadius = "8px";
        editInputBox.style.width = "100%";

        let editInputSubmit = document.createElement("button");
        editInputSubmit.type = "submit";
        editInputSubmit.textContent = "Save";
        editInputSubmit.style.padding = "1px 4px";
        editInputSubmit.style.marginRight = "5px";
        editInputSubmit.style.marginTop = "4px";

        let cancelEditInput = document.createElement("button");
        cancelEditInput.textContent = "Cancel";
        cancelEditInput.style.padding = "1px 4px";
        cancelEditInput.style.marginTop = "4px";
        cancelEditInput.onclick = (e) => {
            document.getElementById("edit-msg-form").remove();
            editing = false;
        };

        editForm.appendChild(editInputBox);
        editForm.appendChild(editInputSubmit);
        editForm.appendChild(cancelEditInput);
        if (!editing) content.appendChild(editForm);
    };


    

    return (
        <div className="message-card"
            key={message.id}
            id={`message-${message.id}`}
        >



            <div>
                <img onClick={(e) => {
                    setSelectedUserRightBar(message.User)
                    toggleRightPane();
                }}
                    src={
                        message.User ? message.User.avatar : user.avatar
                    }
                    alt={`${message.User
                        ? message.User.first_name
                        : user.first_name
                        } ${message.User
                            ? message.User.last_name
                            : user.last_name
                        }`}
                    style={{
                        borderRadius: "5px",
                        width: "36px",
                        height: "36px",
                        cursor: "pointer",
                    }}
                ></img>
            </div>


            <div className="message-card-content">

                <div className="message-card-header">
                    <div>
                        <span
                            className="message-card-name"
                            onClick={(e) => {
                                setSelectedUserRightBar(message.User)
                                toggleRightPane();
                            }}
                        >
                            {message.User
                                ? message.User.first_name
                                : user.first_name}{" "}
                            {message.User
                                ? message.User.last_name
                                : user.last_name}
                        </span>
                        <span className="message-card-time">
                            {new Date(
                                message.updated_at
                            ).toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                            })}
                        </span>
                    </div>

                    <div className="message-card-makechangebox">
                        <span
                            id={`message-adjust-text-${message.id}`}
                            className="message-adjust-text"
                        ></span>
                        <span
                            onMouseOver={(e) =>
                                changeAdjustText("Add Reaction", message.id)
                            }
                            onMouseOut={(e) =>
                                changeAdjustText("", message.id)
                            }
                            className="message-adjust-reaction"
                        >
                            <OpenModalButton
                                modalComponent={
                                    <ReactionModal
                                        socket={socket}
                                        msg={message}
                                        user={user}
                                        dispatch={dispatch}
                                    />
                                }
                                className="far fa-smile"
                            />
                        </span>
                        {/* <span
                                onMouseOver={(e) =>
                                    changeAdjustText("Pin Message", message.id)
                                }
                                onMouseOut={(e) =>
                                    changeAdjustText("", message.id)
                                }
                                className="message-adjust-pin"
                                onClick={(e) => alert("Feature coming soon!")}
                            >
                                <i className="far fa-dot-circle"></i>
                            </span> */}
                        {user.id === message.user_id && (
                            <span
                                onClick={(e) => {
                                    editMode(e, message);
                                    editing = true;
                                }}
                                onMouseOver={(e) =>
                                    changeAdjustText(
                                        "Edit Message",
                                        message.id
                                    )
                                }
                                onMouseOut={(e) =>
                                    changeAdjustText("", message.id)
                                }
                                className="message-adjust-edit"
                            >
                                <i className="far fa-edit"></i>
                            </span>
                        )}

                        {user.id === message.user_id && (
                            <span
                                onMouseOver={(e) =>
                                    changeAdjustText(
                                        "Delete Message",
                                        message.id
                                    )
                                }
                                onMouseOut={(e) =>
                                    changeAdjustText("", message.id)
                                }
                                className="message-adjust-delete"
                            >
                                <OpenModalButton
                                    modalComponent={
                                        <DeleteMessageModal
                                            socket={socket}
                                            msg={message}
                                            user={user}
                                            dispatch={dispatch}
                                        />
                                    }
                                    className="far fa-trash-alt"
                                />
                            </span>
                        )}
                    </div>

                </div>


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
