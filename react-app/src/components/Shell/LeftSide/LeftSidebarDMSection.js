import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import userObjectToNameList from "../../../utils/userObjectToNameList";
import userObjectToAvatar from "../../../utils/userObjectToAvatar";
import { useState, Fragment } from "react";

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

    return (
        <>
            <button onClick={toggleIsHidden} style={{ textDecoration: 'none', marginLeft: "14px", width: "91%" }} >
                <span style={{ width: "20px" }}><i className={`fas fa-caret-${caretDisplayMap[isHidden]}`}></i></span>
                <span className="ellipsis-if-long" style={{ marginLeft: "-3px" }} >Direct Messages</span>
            </button>

            {channels.map((channel) => {
                return (
                    <Fragment key={channel.id} >
                        {isHidden && channel.id !== +channelId ? null : <NavLink key={channel.id} to={`/channels/${channel.id}`} className="tooltip">
                            <div>
                                {Number(channel.id) === Number(channelId) ? (
                                    <>
                                        <button style={{ textDecoration: 'none', backgroundColor: '#275895', color: '#e9e8e8', position: 'relative' }} >
                                            {userObjectToAvatar(channel.Members, user, '#4a73a9', '#ffffff', 'rgb(39, 88, 149)')}
                                            <span id={`${channel.id}-elip`} className="ellipsis-if-long">{userObjectToNameList(channel.Members, user)}</span>
                                        </button>
                                        {userObjectToNameList(channel.Members, user).length >= 28 && (
                                            <span className="tooltiptext">{userObjectToNameList(channel.Members, user)}</span>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <button style={{ textDecoration: 'none' }} >
                                            {userObjectToAvatar(channel.Members, user, '#4b2b53', '#d7ccd9', '#3f0e40')}
                                            <span id={`${channel.id}-elip`} className="ellipsis-if-long">{userObjectToNameList(channel.Members, user)}</span>
                                        </button>
                                        {userObjectToNameList(channel.Members, user).length >= 28 && (
                                            <span className="tooltiptext">{userObjectToNameList(channel.Members, user)}</span>
                                        )}

                                    </>
                                )}
                            </div>

                        </NavLink>}
                    </Fragment>
                )
            })}
        </>
    )
}
