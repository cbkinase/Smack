import { useContext } from "react";
import determineChannelName from "../../../../../utils/determineChannelName";
import SelectedUserRightBarContext from "../../../../../context/SelectedUserRightBar/SelectedUserRightBarContext";
import { toggleRightPane } from "../../../../../utils/togglePaneFunctions";

export default function DirectMessageIntro({ channel, user }) {
    const channelName = determineChannelName(channel, user);

    const [, setSelectedUserRightBar] = useContext(SelectedUserRightBarContext);

    const handleNameClick = (member) => {
        setSelectedUserRightBar(member);
        toggleRightPane();
    }

    let introTitle;
    let channelIntroAbout;
    let channelIntroBtn = null;

    let membersCopy = JSON.parse(JSON.stringify(channel.Members));
    delete membersCopy[user.id];
    let usersArray = Object.values(membersCopy);

    if (Object.values(channel.Members).length === 2) {
        const member = usersArray[0];
        const nameClickFn = e => handleNameClick(member);

        introTitle = <div className="dm-intro-title-container">
                        <img alt="" className="dm-intro-picture" src={member.avatar}></img>
                        <h3 onClick={nameClickFn} id="dm-intro-title">{channelName}</h3>
                    </div>

        channelIntroAbout = <p style={{paddingTop: "13px"}}>
                This conversation is just between {" "}
                    <span onClick={nameClickFn} id="intro-owner-name">{member.first_name} {member.last_name}</span>{" "}
                    and you. Check out their profile to learn more about them.
            </p>

        channelIntroBtn = <button onClick={nameClickFn} className="channel-intro-btn channel-intro-btn-dm">
            View Profile
        </button>
    }

    else {
        const firstMembers = usersArray.slice(0, 5);

        introTitle = <div className="dm-intro-title-container">
                        {firstMembers.map(
                            member =>
                                <img
                                    alt=""
                                    key={member.id}
                                    className="dm-intro-picture-multi"
                                    src={member.avatar}
                                    onClick={e => handleNameClick(member)}
                                />)}
                    </div>

        channelIntroAbout = <p style={{
                                        paddingTop: "13px",
                                        marginBottom: "-25px", // Get rid of this if we add back buttons
                                    }}>
                This is the very beginning of your direct message history with {" "}
                {firstMembers.map(
                    (user, idx) =>
                    <span id="intro-owner-name" onClick={e =>handleNameClick(user)} key={user.id}>
                        {user.first_name} {user.last_name}
                        {idx !== firstMembers.length-1 && ", "}
                    </span>
                )}
                {usersArray.length > firstMembers.length
                    && `, and ${usersArray.length - firstMembers.length} others`}
                .
            </p>
    }

    return (
        <div className="channel-intro-container">
        {introTitle}
            <div className="channel-intro-about">
                {channelIntroAbout}
            </div>
            {channelIntroBtn}
        </div>
    );
}
