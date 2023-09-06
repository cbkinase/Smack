import React, {useContext} from "react";
import toggleOnRightPane from "../../../../RightSide/toggleOnRightPane";
import SelectedUserRightBarContext from "../../../../../../context/SelectedUserRightBar/SelectedUserRightBarContext";

export default function MessageUsername({messageUser, messageUpdatedAt, user}) {
    const [, setSelectedUserRightBar] = useContext(SelectedUserRightBarContext);

    function formatLongDate(d) {
        const date = new Date(d);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const day = date.getDate();

        // Determine the suffix
        let suffix = 'th';
        if (day % 10 === 1 && day !== 11) {
            suffix = 'st';
        } else if (day % 10 === 2 && day !== 12) {
            suffix = 'nd';
        } else if (day % 10 === 3 && day !== 13) {
            suffix = 'rd';
        }

        // Construct formatted string
        return `${months[date.getMonth()]} ${day}${suffix} at ` +
               `${String(date.getHours()).padStart(2, '0')}:` +
               `${String(date.getMinutes()).padStart(2, '0')}:` +
               `${String(date.getSeconds()).padStart(2, '0')}`;
    }

    return (
        <div>
            <span
                className="message-card-name"
                onClick={(e) => {
                    setSelectedUserRightBar(messageUser)
                    toggleOnRightPane();
                }}
            >
                {messageUser
                    ? messageUser.first_name
                    : user.first_name}{" "}
                {messageUser
                    ? messageUser.last_name
                    : user.last_name}
            </span>
            <span className="message-card-time tooltip tooltip-higher">
                {new Date(
                    messageUpdatedAt
                ).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                })}
                <span className="tooltiptext tooltiptext-higher">{formatLongDate(messageUpdatedAt)}</span>
            </span>
        </div>
    )
}
