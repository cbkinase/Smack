import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import userChannelDMSearch from '../../../utils/userChannelDMSearch';
import { useHistory } from 'react-router-dom';
import { AddChannelThunk, UserChannelThunk } from '../../../store/channel';


function RightSideInfo({ selectedUserRightBar, setSelectedUserRightBar }) {
    const user_channels = useSelector(state => state.channels.user_channels)
    const currUser = useSelector(state => state.session.user)
    const history = useHistory();
    const dispatch = useDispatch();

    const hideRightPane = function toggleRightPane() {
        document.getElementById("grid-container").className = "grid-container-hiderightside";
        document.getElementById("grid-rightside-heading").className = "grid-rightside-heading-hide";
        document.getElementById("grid-rightside").className = "grid-rightside-hide";
        window.toggleLeftPane();
    };

    // console.log(selectedUserRightBar);
    // const {avatar, first_name, last_name, bio } = selectedUserRightBar.

    return (
        <div id="grid-rightside" className="grid-rightside-hide">
            <div className="rightside-holder">


                <div className="profile-avatar" style={{ margin: "20px 20px 10px 20px" }}>
                    <img src={selectedUserRightBar?.avatar}
                        alt={`${selectedUserRightBar?.first_name} ${selectedUserRightBar?.last_name}`}
                        style={{ borderRadius: "12px", maxWidth: "100%", maxHeight: "100%", minWidth: "180px" }}></img>
                </div>
                <div
                    style={{ fontSize: "22px", fontWeight: "700", marginBottom: "20px", textAlign: "left", width: "100%" }}>
                    {selectedUserRightBar?.first_name} {selectedUserRightBar?.last_name}
                </div>
                <div style={{ textAlign: "left", width: "100%" }}>
                    {selectedUserRightBar?.bio}

                    <div style={{ marginTop: "20px" }}>
                        <button
                            onClick={async e => {
                                let possibleChannel = userChannelDMSearch(user_channels, currUser, selectedUserRightBar);
                                if (possibleChannel) {
                                    history.push(`/channels/${possibleChannel.id}`);
                                    hideRightPane();
                                }
                                else {
                                    let newChan = await dispatch(AddChannelThunk({
                                        name: "",
                                        subject: "",
                                        is_private: true,
                                        is_direct: true
                                    }))
                                    await fetch(`/api/channels/${newChan.id}/users/${selectedUserRightBar.id}`, {
                                        method: "POST",
                                    });
                                    /*
                                    There's probably a better way to do this, but for now this is how I'm getting the components that depend on the above fetch to re-render, since it doesn't go through Redux at all.
                                     */
                                    await dispatch(UserChannelThunk())
                                    history.push(`/channels/${newChan.id}`);
                                    hideRightPane();
                                }
                            }}
                            style={{ fontSize: "15px", fontWeight: "500", backgroundColor: "#FFFFFF", padding: "5px 8px", borderRadius: "5px", border: "1px solid grey" }}>
                            <i style={{ paddingRight: '5px' }} className="far fa-comment"></i>Message
                        </button>
                    </div>





                </div>
            </div>
        </div>

    );
}

export default RightSideInfo;
