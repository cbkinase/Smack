import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import LeftSideBarDMSection from './LeftSidebarDMSection'

import * as ChlActions from "../../../store/channel"

import OpenModalButton from '../../OpenModalButton';
import CreateChannelModal from '../../CreateFormModal/CreateChannelModal';
function LeftSideLinks() {

    const { channelId } = useParams();

    let defaultState = localStorage.getItem("Channel_Section_Hidden");
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
            localStorage.setItem("Channel_Section_Hidden", newVal.toString());
            return newVal;
        });
    }

    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user);
    const userChannels = useSelector((state) => state.channels.user_channels);

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
                    </NavLink>

                    <div>
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

                <button className="leftside-channeldirect-holder-button" onClick={toggleIsHidden} style={{ textDecoration: 'none', marginLeft: "14px", width: "91%" }} >
                    <span style={{ width: "20px" }}><i className={`fas fa-caret-${caretDisplayMap[isHidden]}`}></i></span>
                    <span className="ellipsis-if-long" style={{marginLeft: "-3px"}} >Channels</span>
                </button>

                {(userChannelList.length > 0) && userChannelList
                    .filter((channel) => !channel.is_direct)
                    .map((channel) => {
                        return (
                            <NavLink hidden={isHidden && channel.id !== +channelId} key={channel.id} exact to={`/channels/${channel.id}`}>

                                <div key={channel.id}>

                                    {Number(channel.id) === Number(channelId) ? (
                                        <button style={{ textDecoration: 'none', backgroundColor: '#275895', color: '#e9e8e8' }} >
                                            <span style={{ width: "20px" }}><i className="fas fa-hashtag"></i></span>
                                            <span className="ellipsis-if-long" >{channel.name}</span>
                                        </button>
                                    ) :
                                     (
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
            <div style={{ position: 'absolute', bottom: '0px' }}>
                <div className="footer" style={{ padding: '20px', justifyContent: 'flex-start', alignItems: "flex-start", backgroundColor: '#3f0e40' }}>

                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '5px', textAlign: 'left' }}>

                        <div>
                            <span style={{ color: '#969696' }}>Cameron Beck:</span>
                        </div>

                        <div className="footer-link">
                            <span>
                                <a className="footer-button" href="https://cbkinase.github.io/" target="_blank" rel="noreferrer">
                                    <button className="copyright-button2">
                                        <i className="fas fa-eye" style={{ fontSize: '14px' }}></i>
                                    </button>
                                </a>
                            </span>
                        </div>

                        <div className="footer-link">
                            <span>
                                <a className="footer-button" href="https://github.com/cbkinase/Smack" target="_blank" rel="noreferrer">
                                    <button className="copyright-button2">
                                        <i className="fa fa-github" style={{ fontSize: '14px' }}></i>
                                    </button>
                                </a>
                            </span>
                        </div>

                        <div className="footer-link">
                            <span>
                                <a className="footer-button" href="https://www.linkedin.com/in/cameron-beck-4a9a44274/" target="_blank" rel="noreferrer">
                                    <button className="copyright-button2">
                                        <i className="fa fa-linkedin-square" style={{ fontSize: '14px' }}></i>
                                    </button>


                                </a>
                            </span>
                        </div>

                    </div >

                    <div className="footer-link" style={{ fontSize: '11px' }}>Additional Contributors:<br />Dave Titus,&nbsp;&nbsp;Brian Hitchin,&nbsp;&nbsp;Cynthia Liang</div>



                </div >
            </div>


        </div>
    );
}

export default LeftSideLinks;
