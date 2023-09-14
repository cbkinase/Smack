import { useSelector } from 'react-redux';
import OnlineStatus from './OnlineStatus';
import OfflineStatus from './OfflineStatus';
import IdleStatus from './IdleStatus';

export default function ActivityStatus({ styles, user, iconOnly }) {
    const onlineUsers = useSelector(state => state.session.onlineUsers);

    if (!onlineUsers) return null;
    if (!user) return null;

    const status = onlineUsers[user.id];
    let content = null;

    if (status === "active") {
        content = <OnlineStatus iconOnly={iconOnly} />
    }
    else if (status === "idle") {
        content = <IdleStatus iconOnly={iconOnly} />
    }
    else {
        content = <OfflineStatus iconOnly={iconOnly} />
    }

    return (
        <div style={styles}>
            {content}
        </div>
    )
}
