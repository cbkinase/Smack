import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, NavLink, useHistory } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { AllChannelThunk, UserChannelThunk } from '../../../../store/channel';

function ChannelHeader() {

    const dispatch = useDispatch()
    const channels = useSelector(state => state.channels)
    const [currChannel, setCurrChannel] = useState(null)
    const [userList, setUserList] = useState(null)
    let numMemb = 0;

    useEffect(() => {
        dispatch(AllChannelThunk())
        dispatch(UserChannelThunk())
    }, [dispatch])

    useEffect(() => {
        if (channels.user_channels && channels.user_channels.length > 0) {
            setCurrChannel(channels.user_channels[Object.keys(channels.user_channels)[0]])
            setUserList(channels["members"][0])
            console.log(channels["members"])
        }
    }, [channels])

    if (currChannel && userList) {
        numMemb = userList.length
    }

    if (numMemb >= 4) {
        return (
            <div className="content-heading-holder">
                <div className="content-header-left">
                    <button className="content-header-channelname">
                        {currChannel && currChannel.name}
                        <i style={{ fontSize: "12px", marginLeft: "3px" }} className="fas fa-angle-down"></i>
                    </button>
                    <div className="content-header-channeltopic">
                        {currChannel && currChannel.subject}
                    </div>
                </div>

                <div className="content-header-right">
                    <button className="content-header-membercount">
                        <img style={{ zIndex: 5 }} className="membercount-image"
                            src={userList && userList[0].avatar}
                            alt="Member"></img>
                        <img style={{ zIndex: 4, position: "relative", left: "-8px" }} className="membercount-image"
                            src={userList && userList[1].avatar}
                            alt="Member"></img>
                        <img style={{ zIndex: 3, position: "relative", left: "-16px" }} className="membercount-image"
                            src={userList && userList[2].avatar}
                            alt="Member"></img>
                        <span style={{ zIndex: 4, position: "relative", left: "-8px" }}>{numMemb}</span>
                    </button>
                </div>
            </div>
        )
    } else if (numMemb === 3) {
        return (
            <div className="content-heading-holder">
                <div className="content-header-left">
                    <button className="content-header-channelname">
                        {currChannel && currChannel.name}
                        <i style={{ fontSize: "12px", marginLeft: "3px" }} className="fas fa-angle-down"></i>
                    </button>
                    <div className="content-header-channeltopic">
                        {currChannel && currChannel.subject}
                    </div>
                </div>

                <div className="content-header-right">
                    <button className="content-header-membercount">
                        <img style={{ zIndex: 5 }} className="membercount-image"
                            src={userList && userList[0].avatar} alt=''></img>
                        <img style={{ zIndex: 4, position: "relative", left: "-8px" }} className="membercount-image"
                            src={userList && userList[1].avatar} alt=''></img>
                        <span style={{ zIndex: 3, position: "relative", left: "-3px" }}>{numMemb}</span>
                    </button>
                </div>
            </div>
        )
    } else {
        return (
            <div className="content-heading-holder">
                <div className="content-header-left">
                    <button className="content-header-channelname">
                        {currChannel && currChannel.name}
                        <i style={{ fontSize: "12px", marginLeft: "3px" }} className="fas fa-angle-down"></i>
                    </button>
                    <div className="content-header-channeltopic">
                        {currChannel && currChannel.subject}
                    </div>
                </div>

                <div className="content-header-right">
                    <button className="content-header-membercount">
                        <img className="membercount-image"
                            src={userList && userList[0].avatar} alt=''></img>
                        <span style={{ padding: "0px 5px" }}>{numMemb}</span>
                    </button>
                </div>
            </div>
        )
    }
}

export default ChannelHeader;
