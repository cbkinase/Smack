import ActivityStatus from "../../ActivityStatus";

export default function ChannelMember({ member, channel, onClickFn }) {
	return (
		<div
			onClick={() => onClickFn(member, channel)}
			key={member.id}
			className="channels-list-item"
			style={{ display: "flex", alignItems: "center", border: "none" }}
		>
			<img
				style={{
					borderRadius: "5px",
					width: "36px",
					height: "36px",
					marginRight: "10px",
				}}
				src={member.avatar}
				alt=""
			></img>
			<p>
				{member.first_name} {member.last_name}
			</p>
			<ActivityStatus
				user={member}
				iconOnly={true}
				styles={{ marginLeft: "5px", paddingTop: "5px" }}
			/>
		</div>
	);
}
