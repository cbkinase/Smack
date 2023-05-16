import { useModal } from "../../context/Modal";
import { useState, useEffect } from "react";
import userObjectToNameList from "../../utils/userObjectToNameList";
import { useDispatch } from "react-redux";
import { UserChannelThunk } from "../../store/channel";

export default function ChannelMembersAll({ currentChannel, numMemb, userList, selectedUserRightBar, setSelectedUserRightBar, user }) {
    const dispatch = useDispatch();
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
    (async function(){
        // Get and display all users except those already in channel
        let res = await fetch(`/api/users/`)
        let data = await res.json();
        let final = normalizeData(data.users);
        for (const usr of userList) {
            delete final[usr.id]
        }
        setAllUsers(Object.values(final))
    })()
  }, [])

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
      return res.length <= 60 ? res : res.slice(0,60) + "..."
    }
    else return `${user.first_name} ${user.last_name}`

}

  return <>
    <div style={{ maxWidth: "600px", width: "60vw", maxHeight: '70vh', padding: "0px 8px 8px 8px", display: 'flex', flexDirection: 'column' }} className="view-all-channels">
      <div className="channels-header">
        <h2 style={{ marginTop: "-10px" }}>{determineName(currentChannel[0], user)}</h2>
        <i onClick={closeModal} className="fa-sharp fa-regular fa-x" style={{ color: "#696969", marginTop: "-10px", backgroundColor: '#f2f2f2', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}></i>
      </div>
      <input id="channel-search" type="text" placeholder="Find members" value={searchTerm} onChange={handleSearchChange} />
      <div className="channels-list" style={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {filteredMembers.map((member, index) => {
          return <div
          onClick={async (e) => {
            await fetch(`/api/channels/${currentChannel[0].id}/users/${member.id}`, {
                method: "POST",
            });
            /*
            There's probably a better way to do this, but for now this is how I'm getting the components that depend on the above fetch to re-render, since it doesn't go through Redux at all.
             */
            await dispatch(UserChannelThunk());
            // setSelectedUserRightBar(member);
            // toggleRightPane();

            closeModal();
          }}
          key={member.id} className="channels-list-item" style={{ display: "flex", alignItems: "center", border: "none" }}>
            <img style={{ borderRadius: "5px", width: "36px", height: "36px", marginRight: "10px" }} src={member.avatar} alt=''></img>
            <p>{member.first_name} {member.last_name}</p>
          </div>
        })}
      </div>
    </div>
  </>
}
