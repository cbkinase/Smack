import userObjectToNameList from "../../../../utils/userObjectToNameList";
import userObjectToAvatar from "../../../../utils/userObjectToAvatar";

export default function DMChannel({ channel, user, isActive }) {
    const backgroundColor = isActive ? '#275895' : undefined;
    const textColor = isActive ? '#e9e8e8' : undefined;
    const bgColor = isActive ? '#4a73a9' : '#4b2b53';
    const avtColor = isActive ? '#ffffff' : '#d7ccd9';
    const bdrColor = isActive ? 'rgb(39, 88, 149)' : '#3f0e40';

    const nameList = userObjectToNameList(channel.Members, user);

    return (
        <>
            <button style={{ textDecoration: 'none', backgroundColor, color: textColor, position: isActive ? 'relative' : undefined }}>
                {userObjectToAvatar(channel.Members, user, bgColor, avtColor, bdrColor)}
                <span id={`${channel.id}-elip`} className="ellipsis-if-long">{nameList}</span>
            </button>
            {nameList.length >= 28 && (
                <span className="tooltiptext">{nameList}</span>
            )}
        </>
    );
};
