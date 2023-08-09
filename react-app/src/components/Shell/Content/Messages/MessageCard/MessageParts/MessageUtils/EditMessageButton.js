import React from "react";
import { editMessage } from "../../../../../../../store/messages";

let updatedMessage;

export default function EditMessageButton({
                                            message, 
                                            user, 
                                            dispatch, 
                                            socket, 
                                            changeAdjustText, 
                                            channelId,
                                            editing }) 
{

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
    )
}