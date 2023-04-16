import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as ChlActions from "../../../../store/channel";
import { NavLink } from "react-router-dom";
import './ViewAllChannels.css';

function AllChannels() {
    const dispatch = useDispatch();
    const allChannels = useSelector((state) => state.channels.all_channels);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(ChlActions.AllChannelThunk());
    }, [dispatch]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
      };



    const allChannelsArr = Object.values(allChannels);

    const filteredChannels = allChannelsArr.filter((channel) => {
        return channel.name.toLowerCase().includes(searchTerm.toLowerCase());
      });

      return (
        <>
        <div className="view-all-channels">
          <div className="channels-header">
            <h2>All Channels on Smack</h2>
          </div>
          <input id="channel-search" type="text" placeholder="Search by channel name" value={searchTerm} onChange={handleSearchChange} />
          <div className="channels-list">
            {(allChannelsArr.length>0) && filteredChannels.map((channel, index) => {
              return <NavLink key={index} className="channels-list-item" onClick={async e => {
                await fetch(`/api/channels/${channel.id}/users`, {
                    method: "POST",
                })
                dispatch(ChlActions.UserChannelThunk())
            }} to={`/channels/${channel.id}`}>
                <div style={{paddingLeft: "10px"}}># {channel.name}</div>
                <p style={{paddingLeft: "10px", color: "grey", fontSize: "12px"}}>{channel.subject}</p>
            </NavLink>
            })}
          </div>
        </div>
        </>
      );
    }

    // return (
    //     <>
    //         <h2 style={{paddingLeft: "20px", margin: "20px 20px"}}>Explore Channels on Smack</h2>
    //         <div>
    //         {allChannelsArr.map((channel) => (
                // <NavLink style={{display: "flex", marginBottom: "10px"}} onClick={async e => {
                //     await fetch(`/api/channels/${channel.id}/users`, {
                //         method: "POST",

                //     })
                //     dispatch(ChlActions.UserChannelThunk())
                // }} to={`/channels/${channel.id}`}>
                //     <div style={{paddingLeft: "40px"}}>{`#${channel.id}`}</div>
                //     <div style={{paddingLeft: "20px"}}>{channel.name}</div>
                // </NavLink>
    //         ))}
    //         </div>
    //     </>
    // );
//     return (
//         <>
// <div class="view-all-channels">
//   <div class="channels-header">
//     <h2>All Channels on Smack</h2>
//     <button class="close-btn">Close</button>
//   </div>
//   <input type="text" placeholder="Search channels"/>
//   <ul class="channels-list">
//     <li>#general</li>
//     <li>#random</li>
//     <li>#marketing</li>
//     <li>#design</li>
//     <li>#engineering</li>
//     <li>#sales</li>
//     <li>#support</li>
//     <li>#product</li>
//     <li>#hr</li>
//     <li>#finance</li>
//   </ul>
// </div>
//         </>
//     )


export default AllChannels;
