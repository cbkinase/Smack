import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as ChlActions from "../../../../store/channel";
import { NavLink } from "react-router-dom";
import './ViewAllChannels.css';
import determineChannelName from "../../../../utils/determineChannelName";
import { adjustLeftPane } from "../../../../utils/togglePaneFunctions";
import useViewportWidth from "../../../../hooks/useViewportWidth";

function DMChannels() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user)
    const allChannels = useSelector((state) => state.channels.user_channels);
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
        dispatch(ChlActions.UserChannelThunk());
    }, [dispatch]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
      };

    const allChannelsArr = Object.values(allChannels).filter((channel) => channel.is_direct /*
      In the event that we end up implementing private channels,
      We would also want to exclude is_private things from here as well.
      Perhaps with the exception of private channels the user is in?

      For now, it's not relevant.

      && !channel.is_private */);

    const filteredChannels = allChannelsArr.filter((channel) => {
      return determineChannelName(channel, user).toLowerCase().includes(searchTerm.toLowerCase());
    });

      return (
        <>
        <div className="view-all-channels">
          <div className="channels-header">
            <h2>Your Direct Messages on Smack</h2>
          </div>
          <input id="channel-search" type="text" placeholder="Search by users" value={searchTerm} onChange={handleSearchChange} />
          <div className="channels-list">
            {(allChannelsArr.length>0) && filteredChannels.map((channel, index) => {
              return <NavLink key={index} className="channels-list-item" to={`/channels/${channel.id}`}>
                <div style={{paddingLeft: "10px"}}>{determineChannelName(channel, user)}</div>
            </NavLink>
            })}
          </div>
        </div>
        </>
      );
    }

export default DMChannels;
