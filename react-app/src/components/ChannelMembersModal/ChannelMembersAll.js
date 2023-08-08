import { useModal } from "../../context/Modal/Modal";
import { useState, useEffect } from "react";
import userObjectToNameList from "../../utils/userObjectToNameList";
import { useDispatch } from "react-redux";
import { UserChannelThunk } from "../../store/channel";
import LoadingSpinner from "../LoadingSpinner";

export default function ChannelMembersAll({ currentChannel, numMemb, userList, user }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const { closeModal } = useModal();

  function normalizeData(data, keyName = "id") {
    const res = {};
    data.forEach((entry) => {
      res[entry[keyName]] = { ...entry };
    });
    return res;
  }
  useEffect(() => {
    (async function () {
      // Get and display all users except those already in channel
      let res = await fetch(`/api/users/`)
      let data = await res.json();
      let final = normalizeData(data.users);
      for (const usr of userList) {
        delete final[usr.id]
      }
      setAllUsers(Object.values(final));
      setIsLoaded(true);
    })()
  }, [userList])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMembers = allUsers.filter((member) => {
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

  return isLoaded ? <>
    <div style={{ maxWidth: "600px", width: "60vw", maxHeight: '70vh', padding: "0px 8px 8px 8px", display: 'flex', flexDirection: 'column' }} className="view-all-channels">
      <div className="channels-header">
        <h2 style={{ marginTop: "-10px" }}>{determineName(currentChannel[0], user)}</h2>
        <button className="edit-modal-close-btn" onClick={() => closeModal()}>
          <i className="fa-solid fa-x"></i>
        </button>
      </div>
      {allUsers.length ? <input id="channel-search" type="text" placeholder="Find members" value={searchTerm} onChange={handleSearchChange} /> : null}
      <div className="channels-list" style={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {filteredMembers.length ? filteredMembers.map((member, index) => {
          return <div
            onClick={async (e) => {
              await fetch(`/api/channels/${currentChannel[0].id}/users/${member.id}`, {
                method: "POST",
              });
              /*
              There's probably a better way to do this, but for now this is how I'm getting the components that depend on the above fetch to re-render, since it doesn't go through Redux at all.
               */
              await dispatch(UserChannelThunk());
              closeModal();
            }}
            key={member.id} className="channels-list-item" style={{ display: "flex", alignItems: "center", border: "none" }}>
            <img style={{ borderRadius: "5px", width: "36px", height: "36px", marginRight: "10px" }} src={member.avatar} alt=''></img>
            <p>{member.first_name} {member.last_name}</p>
          </div>
        }) : <p style={{ alignItems: "center", padding: "16px 16px 5px 16px", marginTop: "5px", display: "block",
        fontWeight: "bold",
        color: "black",
        textDecoration: "none" }}>Sorry, no members found. Invite your friends to join Smack!</p>}
      </div>
    </div>
  </> :
  <div style={{ maxWidth: "600px", width: "60vw", maxHeight: '70vh', padding: "0px 8px 8px 8px", display: 'flex', flexDirection: 'column' }} className="view-all-channels">
          <div className="channels-header">
        <h2 style={{ marginTop: "-10px" }}>{determineName(currentChannel[0], user)}</h2>
        <button className="edit-modal-close-btn" onClick={() => closeModal()}>
          <i className="fa-solid fa-x"></i>
        </button>
      </div>
  <LoadingSpinner offset={true} />
  </div>
}
