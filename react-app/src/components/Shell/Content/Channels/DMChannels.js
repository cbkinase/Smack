import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as ChlActions from "../../../../store/channel";
import { NavLink } from "react-router-dom";
import './ViewAllChannels.css';
import userObjectToNameList from "../../../../utils/userObjectToNameList";

function DMChannels() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user)
    const allChannels = useSelector((state) => state.channels.user_channels);
    const [searchTerm, setSearchTerm] = useState('');

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



    function determineName(channel, user, withoutComma=false) {
        // The name displayed must be different depending on whether it's a DM or not.
        if (!channel.is_direct) return `# ${channel.name}`
        else if (channel.is_direct && Object.values(channel.Members).length > 1) {
            return userObjectToNameList(channel.Members, user, withoutComma)
        }
        else return `${user.first_name} ${user.last_name}`

    }
    const filteredChannels = allChannelsArr.filter((channel) => {
      return determineName(channel, user, true).toLowerCase().includes(searchTerm.toLowerCase());
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
              return <NavLink key={index} className="channels-list-item" onClick={async e => {
                await fetch(`/api/channels/${channel.id}/users`, {
                    method: "POST",
                })
                dispatch(ChlActions.UserChannelThunk())
            }} to={`/channels/${channel.id}`}>
                <div style={{paddingLeft: "10px"}}>{determineName(channel, user)}</div>
                {/* <p style={{paddingLeft: "10px", color: "grey", fontSize: "12px"}}>{channel.subject}</p> */}
            </NavLink>
            })}
          </div>
        </div>
        </>
      );
    }

export default DMChannels;
