import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import userObjectToNameList from "../../../utils/userObjectToNameList";
import userObjectToAvatar from "../../../utils/userObjectToAvatar";
export default function LeftSideBarDMSection({ channels, user }) {
    const { channelId } = useParams();

    return (
        <>
            {/* <!-- ### (leftside-button-selected OPTION) IF THIS MATCHES CURRENT CHANNEL ADD STYLE THIS STYLE TO BUTTON --> */}
            {channels.map((channel) => {
                return (
                    <>
                        <NavLink exact to={`/channels/${channel.id}`} className="tooltip">
                            <div key={channel.id}>
                                {/* <span><img src="https://ca.slack-edge.com/T03GU501J-U0476TK99LH-61c6e53dbd3d-512" alt="DM image" style={{ borderRadius: "5px", width: "20px", height: "20px", marginTop: "4px" }}></img></span>
                    <span className="ellipsis-if-long">{channel.name}</span> */}

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

                        </NavLink>
                    </>
                )
            })}
            {/* <button >
            <span><img src="https://ca.slack-edge.com/T03GU501J-U0476TK99LH-61c6e53dbd3d-512"
                alt="Brian Hitchin"
                style={{ borderRadius: "5px", width: "20px", height: "20px", marginTop: "4px" }}></img></span>
            <span className="ellipsis-if-long">Dave Titus</span>
        </button> */}
        </>
    )
}
