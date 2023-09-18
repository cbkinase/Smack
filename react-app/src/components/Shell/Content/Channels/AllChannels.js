import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as ChlActions from "../../../../store/channel";
import { NavLink } from "react-router-dom";
import './ViewAllChannels.css';
import useViewportWidth from "../../../../hooks/useViewportWidth";
import { adjustLeftPane } from "../../../../utils/togglePaneFunctions";
import isUserInChannel from "../../../../utils/isUserInChannel";

function PublicChannelCard({ user, channel, onChannelClick }) {
  return (
    <NavLink key={channel.id} className="channels-list-item" onClick={e => onChannelClick(user, channel)} to={`/channels/${channel.id}`}>
      <div style={{ paddingLeft: "10px" }}># {channel.name}</div>
      <p style={{ paddingLeft: "10px", color: "grey", fontSize: "12px" }}>{channel.subject}</p>
    </NavLink>
  )
}

function AllChannels() {
  const dispatch = useDispatch();
  const allChannels = useSelector((state) => state.channels.all_channels);
  const user = useSelector((state) => state.session.user);
  const [searchTerm, setSearchTerm] = useState('');
  const viewportWidth = useViewportWidth();

  useEffect(() => {
    if (viewportWidth >= 768) {
      adjustLeftPane("open");
    }
    else {
      adjustLeftPane("close");
    }
  }, [viewportWidth])

  useEffect(() => {
    dispatch(ChlActions.AllChannelThunk());
  }, [dispatch]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const allChannelsArr = Object.values(allChannels).filter((channel) => !channel.is_direct /*
      In the event that we end up implementing private channels,
      We would also want to exclude is_private things from here as well.
      Perhaps with the exception of private channels the user is in?

      For now, it's not relevant.

      && !channel.is_private */);

  const filteredChannels = allChannelsArr.filter((channel) => {
    return channel.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const onChannelClick = async (user, channel) => {
    if (isUserInChannel(user, channel)) {
      return;
    }
    await fetch(`/api/channels/${channel.id}/users`, {
      method: "POST",
    })
    dispatch(ChlActions.UserChannelThunk())
  }

  return (
    <>
      <div className="view-all-channels">
        <div className="channels-header">
          <h2>All Public Channels on Smack</h2>
        </div>
        <input id="channel-search" type="text" placeholder="Search by channel name" value={searchTerm} onChange={handleSearchChange} />
        <div className="channels-list">
          {(allChannelsArr.length > 0) && filteredChannels.map((channel) =>
            <PublicChannelCard key={channel.id} user={user} channel={channel} onChannelClick={onChannelClick} />
          )}
        </div>
      </div>
    </>
  );
}

export default AllChannels;
