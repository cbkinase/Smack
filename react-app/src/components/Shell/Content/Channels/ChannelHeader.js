import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import * as ChlActions from "../../../../store/channel";
import OpenModalButton from '../../../OpenModalButton';
import EditChannelModal from '../../../EditFormModal/EditChannelModal';
import ChannelMembersModal from '../../../ChannelMembersModal';
import userObjectToNameList from '../../../../utils/userObjectToNameList';
import determineChannelName from '../../../../utils/determineChannelName';

function ChannelHeader() {
    const user = useSelector(state => state.session.user);

    const { channelId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const singleChannel = useSelector((state) => state.channels.single_channel);
    let numMemb = 0;
    let userList;

    useEffect(() => {
        dispatch(ChlActions.OneChannelThunk(channelId))
            .then(res => {
                if (res.errors) {
                    navigate('/channels/explore');
                    return;
                }
                let channel = res.single_channel[0]
                document.title = `${determineChannelName(res.single_channel[0], user)} - Smack`

                if (!channel.is_direct) {
                    document.title = `${document.title.slice(1)}`
                }
            })
        return () => {
            document.title = "Smack";
            currentChannel = null;
        };
    }, [dispatch, channelId, navigate, user])

    let currentChannel = Object.values(singleChannel);

    if (currentChannel.length) {
        userList = Object.values(currentChannel[0].Members);
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

    if (!currentChannel.length) return null;

    return (

        <div className="content-heading-holder">
            <div className="content-header-left">
                <OpenModalButton
                renderDownArrow={true}
                    modalComponent={
                        <EditChannelModal
                            channelId={channelId}
                            user={user}
                            currChannel={currentChannel}/>}

                    buttonText={currentChannel.length ? determineName(currentChannel[0], user) : ""}
                    className="content-header-channelname"
                 />
                <div className="content-header-channeltopic">
                    {currentChannel.length ? currentChannel[0].subject : ""}
                </div>
            </div>
            <OpenModalButton
                modalComponent={
                    <ChannelMembersModal
                        currentChannel={currentChannel}
                        numMemb={numMemb}
                        userList={userList}
                        user={user}>
                    </ChannelMembersModal>}
                className="content-header-right"
                userList={userList}
                numMemb={numMemb}
                currUser={user}>
            </OpenModalButton>
        </div>

    )
}


export default ChannelHeader;
