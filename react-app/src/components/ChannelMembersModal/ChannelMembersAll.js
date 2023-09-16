import { useModal } from "../../context/Modal/Modal";
import { useState, useEffect } from "react";
import normalizeData from "../../utils/normalizeData";
import LoadingSpinner from "../LoadingSpinner";
import ChannelMember from "./Subcomponents/ChannelMember";
import MemberModalHeader from "./Subcomponents/MemberModalHeader";

export default function ChannelMembersAll({ currentChannel, numMemb, userList, user }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const { closeModal } = useModal();

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

  async function onMemberClick(member, currentChannel) {
      await fetch(`/api/channels/${currentChannel.id}/users/${member.id}`, {
        method: "POST",
      });
      closeModal();
  }

  if (!isLoaded) {
    return (
      <div className="view-all-channels channel-member-modal-container">
        <MemberModalHeader user={user} channel={currentChannel} />
        <LoadingSpinner offset={true} />
      </div>
    );
  }

  return (
    <div className="channel-member-modal-container">
      <MemberModalHeader user={user} channel={currentChannel} />
      {allUsers.length &&
        <input
          id="channel-search"
          type="text"
          placeholder="Find members"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      }
      <div className="channels-list">
        {filteredMembers.length
          ? filteredMembers.map(member => (
            <ChannelMember key={member.id} member={member} channel={currentChannel} onClickFn={onMemberClick} />
          ))
          : <p className="no-members-found">Sorry, no members found. Invite your friends to join Smack!</p>
        }
      </div>
    </div>
  );
}
