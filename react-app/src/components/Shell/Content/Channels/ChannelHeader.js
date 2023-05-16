import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom'
import { useEffect, useState } from 'react';
import * as ChlActions from "../../../../store/channel";
import OpenModalButton from '../../../OpenModalButton';
import EditChannelModal from '../../../EditFormModal/EditChannelModal';
import ChannelMembersModal from '../../../ChannelMembersModal';
import userObjectToNameList from '../../../../utils/userObjectToNameList';

function ChannelHeader({selectedUserRightBar, setSelectedUserRightBar}) {
    const user = useSelector(state => state.session.user)

    // const { setPane, selectedUserRightBar, setSelectedUserRightBar } = props;
    // console.log(selectedUserRightBar);
    // console.log(selectedUserRightBar);



    const { channelId } = useParams();
    const history = useHistory();
    const dispatch = useDispatch()
    const singleChannel = useSelector((state) => state.channels.single_channel)
    let numMemb = 0;
    let userList;

    useEffect(() => {
        const thisChannel = dispatch(ChlActions.OneChannelThunk(channelId))
            .then(res => {if (res.errors) history.push('/channels/explore')})
    }, [dispatch, channelId])

    const currentChannel = Object.values(singleChannel);

    if (currentChannel.length) {
        userList = Object.values(currentChannel[0].Members)
    }

    if (currentChannel.length && userList) {
        numMemb = userList.length
    }

    function determineName(channel, user) {
        // The name displayed must be different depending on whether it's a DM or not.
        if (!channel.is_direct) return `# ${channel.name}`
        else if (channel.is_direct && Object.values(channel.Members).length > 1) {
            return userObjectToNameList(channel.Members, user)
        }
        else return `${user.first_name} ${user.last_name}`

    }

    return (

        <div className="content-heading-holder">
            <div className="content-header-left">
                {/* <button className="content-header-channelname" style={{ whiteSpace: 'nowrap' }} onClick={() => handlePane('editChannel')}>
                    # {currentChannel.length && currentChannel[0].name}
                    <i style={{ fontSize: "12px", marginLeft: "3px" }} className="fas fa-angle-down"></i>
                </button> */}
                <OpenModalButton
                renderDownArrow={true}
                    modalComponent={
                        <EditChannelModal
                            channelId={channelId}
                            user={user}
                            currChannel={currentChannel}

                        />}
                    buttonText={currentChannel.length && determineName(currentChannel[0], user)}
                    className="content-header-channelname"
                 />
                <div className="content-header-channeltopic">
                    {currentChannel.length && currentChannel[0].subject}
                </div>
            </div>
            <OpenModalButton modalComponent={<ChannelMembersModal selectedUserRightBar={selectedUserRightBar} setSelectedUserRightBar={setSelectedUserRightBar} currentChannel={currentChannel} numMemb={numMemb} userList={userList} user={user}></ChannelMembersModal>} className="content-header-right" userList={userList} numMemb={numMemb}></OpenModalButton>



            {/* {numMemb >= 4 &&
                <OpenModalButton modalComponent={<SignupFormModal></SignupFormModal>} className="content-header-right" userList={userList} numMemb={numMemb}> */}
                    {/* <div  className="content-header-membercount">
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
                    </div > */}
                {/* </OpenModalButton> */}
            {/* } */}

            {/* {numMemb === 3 &&
                <OpenModalButton className="content-header-right">
                    <div className="content-header-membercount">
                        <img style={{ zIndex: 5 }} className="membercount-image"
                            src={userList && userList[0].avatar} alt=''></img>
                        <img style={{ zIndex: 4, position: "relative", left: "-8px" }} className="membercount-image"
                            src={userList && userList[1].avatar} alt=''></img>
                        <span style={{ zIndex: 3, position: "relative", left: "-3px" }}>{numMemb}</span>
                    </div>
                </OpenModalButton>
            }

            {numMemb < 3 &&
                <div className="content-header-right">
                    <div className="content-header-membercount">
                        <img className="membercount-image"
                            src={userList && userList[0].avatar} alt=''></img>
                        <span style={{ padding: "0px 5px" }}>{numMemb}</span>
                    </div>
                </div>
            } */}


        </div>

    )
}


export default ChannelHeader;
