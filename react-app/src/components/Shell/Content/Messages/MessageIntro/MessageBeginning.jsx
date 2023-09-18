import isSelfDM from "../../../../../utils/isSelfDM";
import PublicIntro from "./PublicIntro";
import DirectMessageIntro from "./DirectMessageIntro";
import SelfDMIntro from "./SelfDMIntro";
import "./MessageIntro.css";

export default function MessageBeginning({ channel, user }) {
	if (!channel) return null;

	if (isSelfDM(channel, user)) {
		return <SelfDMIntro user={user} />;
	}

	if (channel.is_direct) {
		return <DirectMessageIntro channel={channel} user={user} />;
	}

	return <PublicIntro channel={channel} user={user} />;
}
