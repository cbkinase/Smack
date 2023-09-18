import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import DMChannel from "./Subcomponents/DMChannel";
import { useState, Fragment } from "react";
import { toggleRightPane } from "../../../utils/togglePaneFunctions";

export default function LeftSideBarDMSection({ channels, user }) {
    const { channelId } = useParams();

    let defaultState = localStorage.getItem("DM_Section_Hidden");
    if (defaultState) {
        defaultState = defaultState === "false" ? false : true;
    }
    else {
        defaultState = false;
    }

    const [isHidden, setIsHidden] = useState(defaultState);
    const caretDisplayMap = {
        false: "down",
        true: "right",
    }
    const toggleIsHidden = () => {
        setIsHidden((val) => {
            const newVal = !val;
            localStorage.setItem("DM_Section_Hidden", newVal.toString());
            return newVal
        });
    }

    const closeRightPane = (e) => {
        if (document.getElementsByClassName("grid-rightside-heading")[0]) {
            toggleRightPane("close");
        }
    }

    return (
        <>
            <button onClick={toggleIsHidden} style={{ textDecoration: 'none', marginLeft: "14px", width: "91%" }} >
                <span style={{ width: "20px" }}><i className={`fas fa-caret-${caretDisplayMap[isHidden]}`}></i></span>
                <span className="ellipsis-if-long" style={{ marginLeft: "-3px" }} >Direct Messages</span>
            </button>

            {channels.map((channel) => {
                return (
                    <Fragment key={channel.id} >
                        {isHidden && channel.id !== +channelId
                            ? null
                            : <NavLink
                                onClick={closeRightPane}
                                key={channel.id}
                                to={`/channels/${channel.id}`}
                                className="tooltip">
                            <div>
                                {Number(channel.id) === Number(channelId)
                                    ? <DMChannel isActive={true} channel={channel} user={user} />
                                    : <DMChannel channel={channel} user={user} />
                                }
                            </div>
                        </NavLink>}
                    </Fragment>
                )
            })}
        </>
    )
}
