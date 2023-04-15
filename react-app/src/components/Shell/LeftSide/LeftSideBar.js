import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import * as ChlActions from "../../../store/channel"

function LeftSideLinks() {

    const dispatch = useDispatch()
    const history = useHistory()
    const sessionUser = useSelector(state => state.session.user);
    const userChannels = useSelector((state) => state.channels.user_channels)


    useEffect(() => {
        dispatch(ChlActions.UserChannelThunk());
    }, [dispatch])

    const userChannelList = Object.values(userChannels);

    return (

        <div id="grid-leftside" className="grid-leftside-threecolumn">


            <div className="leftside-link-holder">

                <div className="leftside-channeldirect-holder">

                    <NavLink exact to={`/channels/explore`}>
                        <div>
                            <button>
                                <span style={{ width: "20px" }}><i className="fa fa-newspaper-o"></i></span>
                                <span className="ellipsis-if-long">All Channels</span>
                            </button>
                        </div>
                    </NavLink>

                    <NavLink onClick={
                        e => {
                            e.preventDefault();
                            alert("Direct Message Feature Coming Soon")
                        }
                    } exact to={`/channels/direct`}>
                        <div>
                            <button>
                                <span style={{ width: "20px" }}><i className="far fa-comments"></i></span>
                                <span className="ellipsis-if-long">Direct Messages</span>
                            </button>
                        </div>
                    </NavLink>

                    <NavLink exact to={`/channels/new`}>
                        <div>
                            <button>
                                <span style={{ width: "20px" }}><i className="far fa-comment"></i></span>
                                <span className="ellipsis-if-long">Create New Channel</span>
                            </button>
                        </div>
                    </NavLink>

                </div>


            </div>


            <div className="leftside-channeldirect-holder">

                {/* <!-- ------ Spacer Div for Between leftside sections------- --> */}
                <div style={{ padding: "4px" }}></div>

                {userChannelList && userChannelList.map((channel, idx) => {
                    return (
                        <NavLink exact to={`/channels/${channel.id}`}>
                            <div key={idx}>

                                <button>
                                    <span style={{ width: "20px" }}><i className="fas fa-hashtag"></i></span>
                                    <span className="ellipsis-if-long" >{channel.name}</span>
                                </button>
                            </div>
                        </NavLink>

                    )
                })}

                {/* <!-- ------ Spacer Div for Between leftside sections------- --> */}
                <div style={{ padding: "8px" }}></div>


                <div>
                    <button>
                        <span><img src="https://ca.slack-edge.com/T0266FRGM-UQ46QH94Z-gc24d346e359-512"
                            alt="Brian Hitchin"
                            style={{ borderRadius: "5px", width: "20px", height: "20px", marginTop: "4px" }}></img></span>
                        <span className="ellipsis-if-long">Brian Hitchin</span>
                    </button>
                </div>

                <div className="tooltip">
                    <button>
                        <span><img src="https://ca.slack-edge.com/T03GU501J-U04B5SVB5N1-fe508f121b64-512"
                            alt="Brian Hitchin"
                            style={{ borderRadius: "5px", width: "20px", height: "20px", marginTop: "4px" }}></img></span>
                        <span className="ellipsis-if-long">Cameron Beck, Brian Hitchin, Cynthia Liang</span>
                    </button>
                    <span className="tooltiptext">Cameron Beck, Brian Hitchin, Cynthia Liang</span>
                </div>

                <div>
                    {/* <!-- ### (SELECTED OPTION) IF THIS MATCHES CURRENT CHANNEL ADD STYLE THIS STYLE TO BUTTON --> */}
                    <button style={{ backgroundColor: "#275895", color: "#e9e8e8" }}>
                        <span><img src="https://ca.slack-edge.com/T03GU501J-U0476TK99LH-61c6e53dbd3d-512"
                            alt="Brian Hitchin"
                            style={{ borderRadius: "5px", width: "20px", height: "20px", marginTop: "4px" }}></img></span>
                        <span className="ellipsis-if-long">Dave Titus</span>
                    </button>
                </div>

            </div>


        </div>
    );
}

export default LeftSideLinks;
