import React from "react";
import OpenModalButton from "../../../../../../OpenModalButton";
import ReactionModal from "../../../../../../ReactionModal";

export default function AddReactionButton({message, user, socket, dispatch, changeAdjustText}) {

    return (
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
    )
}