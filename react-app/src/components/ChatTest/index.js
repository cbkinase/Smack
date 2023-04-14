import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import {
    createChannelMessage,
    getChannelMessages,
    editMessage,
    destroyMessage,
    thunkDeleteReaction,
    thunkCreateReaction,
} from "../../store/messages";
import { useParams } from "react-router-dom";
let socket;

// function emojiRenderer(counts, msg) {
//     let countEntries = Object.entries(counts);
//     console.log(countEntries);
//     return countEntries.map((el) => (
//         <>
//             <div>
//                 {el[0]}: {el[1][0]}
//             </div>
//             <button onClick={(e) => handleDeleteReaction(e, el[1][1])}>
//                 Delete Reaction
//             </button>
//         </>
//     ));
// }

const Chat = () => {
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [reactions, setReactions] = useState([]);
    const user = useSelector((state) => state.session.user);
    const dispatch = useDispatch();
    const allMessages = useSelector((state) => state.messages.allMessages);
    const { channelId } = useParams();

    useEffect(() => {
        dispatch(getChannelMessages(channelId));
    }, [dispatch, messages, reactions, channelId]);

    useEffect(() => {
        // open socket connection
        // create websocket
        socket = io();

        socket.on("chat", (chat) => {
            setMessages((messages) => [...messages, chat]);
        });

        socket.on("delete", (chat) => {
            let messageIdx = messages.findIndex((msg) => msg === chat);
            let newMessages = messages.filter((_, idx) => idx !== messageIdx);
            setMessages(newMessages);
        });

        socket.on("edit", (chat) => {
            let messageIdx = messages.findIndex(
                (msg) => msg.id === chat.msg_id
            );
            messages[messageIdx] = chat;
            let newMessages;
            setMessages(newMessages);
        });

        socket.on("deleteReaction", (reaction) => {
            let reactionIdx = reactions.findIndex((rxn) => rxn === reaction);
            let newReactions = reactions.filter(
                (_, idx) => idx !== reactionIdx
            );
            setReactions(newReactions);
            // console.log(reactions);
        });

        socket.on("addReaction", (reaction) => {
            setReactions((reactions) => [...reactions, reaction]);
            console.log(reactions);
        });
        // when component unmounts, disconnect
        return () => {
            socket.disconnect();
        };
    }, []);

    const updateChatInput = (e) => {
        setChatInput(e.target.value);
    };

    const sendChat = async (e) => {
        e.preventDefault();
        socket.emit("chat", { user: user.username, msg: chatInput });
        const newMessage = {
            user_id: user.id,
            channel_id: channelId,
            content: chatInput,
        };
        await dispatch(createChannelMessage(newMessage));
        setChatInput("");
    };

    const handleDelete = (e, msg) => {
        dispatch(destroyMessage(msg.id));
        socket.emit("delete", { user: user.username, msg: msg.content });
    };
    const handleEdit = (e, msg) => {
        dispatch(
            editMessage(
                {
                    content: "New message content - test",
                    user_id: user.id,
                    channel_id: channelId,
                    is_pinned: false,
                },
                msg.id
            )
        );

        socket.emit("edit", {
            user: user.username,
            msg: msg.content,
            msg_id: msg.id,
        });
    };
    function handleDeleteReaction(e, reaction) {
        e.preventDefault();
        dispatch(thunkDeleteReaction(reaction));
        socket.emit("deleteReaction", {
            user: user.username,
            reaction: reaction.reaction,
        });
    }
    function handleAddReaction(e, msg, rxn, message) {
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

    function storeConverter(msg, user) {
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

            // counts[num[0]] = counts[num[0]] ? counts[num[0]] + 1 : 1;
        }

        let countEntries = Object.entries(counts);

        return countEntries.map((el) => (
            <>
                {hasUserReacted(msg, user, el[0]) ? (
                    <button
                        onClick={(e) =>
                            handleDeleteReaction(
                                e,
                                hasUserReacted(msg, user, el[0]),
                                msg.id
                            )
                        }
                    >
                        {el[0]} {counts[el[0]].frequency}
                    </button>
                ) : (
                    <button onClick={(e) => handleAddReaction(e, msg, el[0])}>
                        {el[0]} {counts[el[0]].frequency}
                    </button>
                )}
            </>
        ));
    }

    return (
        user && (
            <div>
                <div>
                    {Object.values(allMessages).map((message, ind) => (
                        <div
                            style={{
                                padding: "10px 10px",
                                display: "flex",
                                justifyContent: "space-even",
                            }}
                        >
                            <div key={ind}>
                                {`${message.User?.username} at ${message.updated_at}: ${message.content}`}
                            </div>
                            {storeConverter(message, user)}
                            {user.id === message.user_id && (
                                <button
                                    onClick={(e) => handleDelete(e, message)}
                                >
                                    Delete
                                </button>
                            )}
                            {user.id === message.user_id && (
                                <button onClick={(e) => handleEdit(e, message)}>
                                    Edit
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <form onSubmit={sendChat}>
                    <input value={chatInput} onChange={updateChatInput} />
                    <button type="submit">Send</button>
                </form>
            </div>
        )
    );
};

export default Chat;
