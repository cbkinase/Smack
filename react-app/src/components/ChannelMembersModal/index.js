import { useModal } from "../../context/Modal";
import { useState } from "react";
import userObjectToNameList from "../../utils/userObjectToNameList";
import OpenModalButton from "../OpenModalButton";
import ChannelMembersAll from "./ChannelMembersAll";

export default function ChannelMembersModal({ currentChannel, numMemb, userList, selectedUserRightBar, setSelectedUserRightBar, user }) {
  // console.log(selectedUserRightBar);
  function toggleRightPane(state) {
    if (state === "close") {
      document.getElementById("grid-container").className =
        "grid-container-hiderightside";
      document.getElementById("grid-rightside-heading").className =
        "grid-rightside-heading-hide";
      document.getElementById("grid-rightside").className =
        "grid-rightside-hide";
    } else {
      document.getElementById("grid-container").className =
        "grid-container";
      document.getElementById("grid-rightside-heading").className =
        "grid-rightside-heading";
      document.getElementById("grid-rightside").className =
        "grid-rightside";
    }
    window.toggleLeftPane();
  }
  const [searchTerm, setSearchTerm] = useState('');
  const { closeModal } = useModal();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMembers = userList.filter((member) => {
    let fullName = member.first_name.toLowerCase() + " " + member.last_name.toLowerCase()
    return fullName.includes(searchTerm.toLowerCase());
  });

  function determineName(channel, user) {
    // The name displayed must be different depending on whether it's a DM or not.
    if (!channel.is_direct) return `# ${channel.name}`
    else if (channel.is_direct && Object.values(channel.Members).length > 1) {
      let res = userObjectToNameList(channel.Members, user)
      return res.length <= 60 ? res : res.slice(0, 60) + "..."
    }
    else return `${user.first_name} ${user.last_name}`

  }

  return <>
    <div style={{ maxWidth: "600px", width: "60vw", maxHeight: '70vh', padding: "0px 8px 8px 8px", display: 'flex', flexDirection: 'column' }} className="view-all-channels">
      <div className="channels-header">
        <h2 style={{ marginTop: "-10px" }}>{determineName(currentChannel[0], user)}</h2>
        <button className="edit-modal-close-btn" onClick={() => closeModal()}>
          <i className="fa-solid fa-x"></i>
        </button>
      </div>
      <input id="channel-search" type="text" placeholder="Find members" value={searchTerm} onChange={handleSearchChange} />
      <div className="channels-list" style={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {filteredMembers.map((member, index) => {
          return <div onClick={(e) => {
            setSelectedUserRightBar(member)
            toggleRightPane();
            closeModal();
          }} key={member.id} className="channels-list-item" style={{ display: "flex", alignItems: "center", border: "none" }}>
            <img style={{ borderRadius: "5px", width: "36px", height: "36px", marginRight: "10px" }} src={member.avatar} alt=''></img>
            <p>{member.first_name} {member.last_name}</p>
          </div>
        })}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
          {<OpenModalButton className="login-input-submit-alt" modalComponent={<ChannelMembersAll currentChannel={currentChannel} numMemb={numMemb} userList={userList} selectedUserRightBar={selectedUserRightBar} setSelectedUserRightBar={setSelectedUserRightBar} user={user} />} buttonText="Add members" />}
        </div>
      </div>
    </div>
  </>
}
