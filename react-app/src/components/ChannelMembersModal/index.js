import { useModal } from "../../context/Modal";
import { useState } from "react";

export default function ChannelMembersModal({currentChannel, numMemb, userList, selectedUserRightBar, setSelectedUserRightBar}) {
    console.log(selectedUserRightBar);
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

    return <>
    <div style={{maxWidth: "600px", width: "60vw", padding: "0px 8px 8px 8px"}} className="view-all-channels">
      <div className="channels-header">
        <h2 style={{marginTop: "-10px"}}># {currentChannel[0].name}</h2>
        <i onClick={closeModal} className="fa-sharp fa-regular fa-x" style={{color: "#696969", marginTop: "-10px"}}></i>
      </div>
      <input id="channel-search" type="text" placeholder="Find members" value={searchTerm} onChange={handleSearchChange} />
      <div className="channels-list">
        {filteredMembers.map((member, index) => {
          return <div onClick={(e) => {
            setSelectedUserRightBar(member)
            toggleRightPane();
            closeModal();}} key={member.id} className="channels-list-item" style={{display: "flex", alignItems: "center", border: "none"}}>
            <img style={{borderRadius: "5px", width: "36px", height: "36px", marginRight: "10px"}} src={member.avatar}></img>
            <p>{member.first_name} {member.last_name}</p>

          </div>
        })}
      </div>
    </div>
    </>
}
