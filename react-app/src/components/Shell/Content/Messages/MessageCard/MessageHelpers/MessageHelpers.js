
import { thunkDeleteReaction,
         thunkCreateReaction
 } from "../../../../../../store/messages";



function handleDeleteReaction(e, reaction, dispatch, socket, user) {
    e.preventDefault();
    dispatch(thunkDeleteReaction(reaction));
    socket.emit("deleteReaction", {
        user: user.username,
        reaction: reaction.reaction,
    });
}

function handleAddReaction(e, msg, rxn, dispatch, socket, user) {
    e.preventDefault();
    dispatch(thunkCreateReaction(msg.id, { reaction: rxn }));
    socket.emit("addReaction", {
        user: user.username,
        reaction: rxn,
    });
}

function hasUserReacted(message, user, reaction) {
    // Define logic for seeing whether
    // A user has posted a given reaction
    // To a given message
    let userReaction = Object.values(message.Reactions).filter(
        (rxn) => rxn.user_id === user.id && rxn.reaction === reaction
    );
    if (!userReaction.length) return null;
    return userReaction[0];
}

export default function storeConverter(msg, user, Fragment, dispatch, socket) {
    if (!msg.Reactions) return null;
    let arr = Object.values(msg.Reactions);
    let emojiStuff = arr.map((el) => [el.reaction, el.id]);
    const counts = {};

    for (const num of emojiStuff) {
        if (!counts[num[0]]) {
            let countObj = {
                frequency: 1,
                reaction_ids: [num[1]],
            };

            counts[num[0]] = countObj;
            continue;
        }

        counts[num[0]].frequency++;
        counts[num[0]].reaction_ids.push(num[1]);
    }

    let countEntries = Object.entries(counts);

    return countEntries.map((el) => (
        <Fragment key={el[0]}>

            {hasUserReacted(msg, user, el[0]) ? (


                <button
                    style={{ padding: "0px 6px", backgroundColor: "#e7f3f9", border: "1px solid #bad3f2" }}
                    className="message-card-reaction"
                    onClick={(e) =>
                        handleDeleteReaction(
                            e,
                            hasUserReacted(msg, user, el[0]),
                            dispatch,
                            socket,
                            user
                        )
                    }
                >
                    <p style={{ paddingRight: "5px" }}>{el[0]}</p> <p style={{ fontSize: '12px', color: "#333333" }}>{counts[el[0]].frequency}</p>
                </button >
            ) : (
                <button
                    style={{ padding: "0px 6px" }}
                    className="message-card-reaction"
                    onClick={(e) => handleAddReaction(e, msg, el[0], dispatch, socket, user)}
                >
                    {el[0]}{" "}
                    <span className="message-card-reaction-count">

                        <p style={{ paddingRight: "5px" }}>{counts[el[0]].frequency}</p>
                    </span>
                </button>
            )
            }


        </Fragment>
    ));
}
