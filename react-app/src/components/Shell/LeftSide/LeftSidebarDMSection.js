import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import userObjectToNameList from "../../../utils/userObjectToNameList";
export default function LeftSideBarDMSection({channels, user}) {
    const { channelId } = useParams();
    return (
        <div>
        {/* <!-- ### (leftside-button-selected OPTION) IF THIS MATCHES CURRENT CHANNEL ADD STYLE THIS STYLE TO BUTTON --> */ }
        {channels.map((channel) => {
            return (
                <NavLink exact to={`/channels/${channel.id}`}>
                    <div key={channel.id}>
                    {/* <span><img src="https://ca.slack-edge.com/T03GU501J-U0476TK99LH-61c6e53dbd3d-512" alt="DM image" style={{ borderRadius: "5px", width: "20px", height: "20px", marginTop: "4px" }}></img></span>
                    <span className="ellipsis-if-long">{channel.name}</span> */}
                     {Number(channel.id) === Number(channelId) ? (
                                    <button style={{ textDecoration: 'none', backgroundColor: '#275895', color: '#e9e8e8' }} >
                                        <span style={{ width: "20px" }}><i className="fas fa-lock"></i></span>
                                        <span className="ellipsis-if-long" >{userObjectToNameList(channel.Members, user.id)}</span>
                                    </button>
                                ) : (
                                    <button style={{ textDecoration: 'none' }} >
                                        <span style={{ width: "20px" }}><i className="fas fa-lock"></i></span>
                                        <span className="ellipsis-if-long" >{userObjectToNameList(channel.Members, user.id)}</span>
                                    </button>
                                )}
                    </div>

                </NavLink>
            )
        })}
    {/* <button >
            <span><img src="https://ca.slack-edge.com/T03GU501J-U0476TK99LH-61c6e53dbd3d-512"
                alt="Brian Hitchin"
                style={{ borderRadius: "5px", width: "20px", height: "20px", marginTop: "4px" }}></img></span>
            <span className="ellipsis-if-long">Dave Titus</span>
        </button> */}
    </div>
    )
}
