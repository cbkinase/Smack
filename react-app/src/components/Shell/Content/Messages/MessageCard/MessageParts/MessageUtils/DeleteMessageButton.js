import React from "react";
import OpenModalButton from "../../../../../../OpenModalButton";
import DeleteMessageModal from "../../../../../../DeleteMessageModal";

export default function DeleteMessageButton({message, user, socket, dispatch, changeAdjustText}) {
    return (
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
    )
}