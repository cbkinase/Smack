import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import * as ChlActions from "../../../store/channel"

import OpenModalButton from '../../OpenModalButton';
import CreateChannelModal from '../../CreateFormModal/CreateChannelModal';
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
                                <span className="ellipsis-if-long">Explore Channels</span>
                            </button>
                        </div>
                    </NavLink>

                    <NavLink onClick={
                        e => {
                            e.preventDefault();
                            alert("Direct Message Feature Coming Soon")
                        }
                    } exact to={`/channels/direct`}
                    >
                        <div>
                            <button>
                                <span style={{ width: "20px" }}><i className="far fa-comments"></i></span>
                                <span className="ellipsis-if-long">Direct Messages</span>
                            </button>
                        </div>
                    </NavLink>

                        <div>
                            {/* <button>
                                <span style={{ width: "20px" }}><i className="far fa-comment"></i></span>
                                <span className="ellipsis-if-long">Create New Channel</span>
                            </button> */}
                            <OpenModalButton
                                modalComponent={
                                    <CreateChannelModal
                                        user={sessionUser}
                                    />}
                                buttonText={`Create a New Channel`}
                                className="ellipsis-if-long"
                                renderChatIcon={true}
                            />
                        </div>

                </div>


            </div>


            <div className="leftside-channeldirect-holder">

                {/* <!-- ------ Spacer Div for Between leftside sections------- --> */}
                <div style={{ padding: "4px" }}></div>

                {userChannelList.length && userChannelList.map((channel, idx) => {
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

                {/* <div>
                    {/* <!-- ### (leftside-button-selected OPTION) IF THIS MATCHES CURRENT CHANNEL ADD STYLE THIS STYLE TO BUTTON --> */}
                    {/* <button >
                        <span><img src="https://ca.slack-edge.com/T03GU501J-U0476TK99LH-61c6e53dbd3d-512"
                            alt="Brian Hitchin"
                            style={{ borderRadius: "5px", width: "20px", height: "20px", marginTop: "4px" }}></img></span>
                        <span className="ellipsis-if-long">Dave Titus</span>
                    </button>
                </div>  */}

            </div>


        </div>
    );
}

export default LeftSideLinks;
