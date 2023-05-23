import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import LeftSideBarDMSection from './LeftSidebarDMSection'

import * as ChlActions from "../../../store/channel"

import OpenModalButton from '../../OpenModalButton';
import CreateChannelModal from '../../CreateFormModal/CreateChannelModal';
function LeftSideLinks() {

    const { channelId } = useParams();

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

                            {/explore/.test(window.location.href) ? (
                                <button style={{ textDecoration: 'none', backgroundColor: '#275895', color: '#e9e8e8' }}>
                                    <span style={{ width: "20px" }}><i className="fa fa-newspaper-o"></i></span>
                                    <span className="ellipsis-if-long">Explore Channels</span>
                                </button>
                            ) : (
                                <button style={{ textDecoration: 'none' }}>
                                    <span style={{ width: "20px" }}><i className="fa fa-newspaper-o"></i></span>
                                    <span className="ellipsis-if-long">Explore Channels</span>
                                </button>
                            )}


                        </div>
                    </NavLink>

                    <NavLink
                    // onClick={e => {
                    //         e.preventDefault();
                    //         alert("Direct Message Feature Coming Soon")
                    //     }
                    // }
                    exact to={`/channels/direct`}
                    >
                      <div>
                      {/\/channels\/direct/.test(window.location.href) ? (
                                <button style={{ textDecoration: 'none', backgroundColor: '#275895', color: '#e9e8e8' }}>
                                    <span style={{ width: "20px" }}><i className="far fa-comments"></i></span>
                                    <span className="ellipsis-if-long">Direct Messages</span>
                                </button>
                            ) : (
                                <button style={{ textDecoration: 'none' }}>
                                    <span style={{ width: "20px" }}><i className="far fa-comments"></i></span>
                                    <span className="ellipsis-if-long">Direct Messages</span>
                                </button>
                            )}
                      </div>
                        {/* <div>
                            <button style={{ textDecoration: 'none' }}>
                                <span style={{ width: "20px" }}><i className="far fa-comments"></i></span>
                                <span className="ellipsis-if-long">Direct Messages</span>
                            </button>
                        </div> */}
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

                {(userChannelList.length > 0) && userChannelList
                .filter((channel) => !channel.is_direct)
                .map((channel) => {
                    return (
                        <NavLink exact to={`/channels/${channel.id}`}>

                            <div key={channel.id}>

                                {Number(channel.id) === Number(channelId) ? (
                                    <button style={{ textDecoration: 'none', backgroundColor: '#275895', color: '#e9e8e8' }} >
                                        <span style={{ width: "20px" }}><i className="fas fa-hashtag"></i></span>
                                        <span className="ellipsis-if-long" >{channel.name}</span>
                                    </button>
                                ) : (
                                    <button style={{ textDecoration: 'none' }} >
                                        <span style={{ width: "20px" }}><i className="fas fa-hashtag"></i></span>
                                        <span className="ellipsis-if-long" >{channel.name}</span>
                                    </button>
                                )}


                            </div>
                        </NavLink>

                    )
                })}

                {/* <!-- ------ Spacer Div for Between leftside sections------- --> */}
                <div style={{ padding: "8px" }}></div>

                <LeftSideBarDMSection user={sessionUser} channels={userChannelList.filter((channel) => channel.is_direct)} />


            </div>


        </div>
    );
}

export default LeftSideLinks;
