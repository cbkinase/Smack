import React, {useContext} from "react";
import toggleOnRightPane from "../../../../RightSide/toggleOnRightPane";

export default function MessageUser({messageUser, user, setSelectedUserRightBar}) {

    return (
        <div>
            <img onClick={(e) => {
                setSelectedUserRightBar(messageUser)
                toggleOnRightPane();
            }}
                src={
                    messageUser ? messageUser.avatar : user.avatar
                }
                alt={`${messageUser
                    ? messageUser.first_name
                    : user.first_name
                    } ${messageUser
                        ? messageUser.last_name
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
    )
}