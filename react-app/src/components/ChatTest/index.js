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
import { OneChannelThunk } from "../../store/channel";
import { useParams } from "react-router-dom";
let socket;

const Chat = () => {
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [reactions, setReactions] = useState([]);
    const user = useSelector((state) => state.session.user);
    const dispatch = useDispatch();
    const allMessages = useSelector((state) => state.messages.allMessages);
    const { channelId } = useParams();
    const currentChannel = useSelector(
        (state) => state.channels.single_channel
    );

    useEffect(() => {
        dispatch(OneChannelThunk(channelId));
    }, []);

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

        const newMessage = {
            user_id: user.id,
            channel_id: channelId,
            content: chatInput,
        };
        await dispatch(createChannelMessage(newMessage));
        socket.emit("chat", { user: user.username, msg: chatInput });
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
                <div className="message-card-footer">
                    {hasUserReacted(msg, user, el[0]) ? (
                        <button
                            className="message-card-reaction"
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
                        <button
                            className="message-card-reaction"
                            onClick={(e) => handleAddReaction(e, msg, el[0])}
                        >
                            {el[0]}{" "}
                            <span className="message-card-reaction-count">
                                {" "}
                                {counts[el[0]].frequency}
                            </span>
                        </button>
                    )}
                </div>
            </>
        ));
    }

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
        // toggleLeftPane();
    }

    function changeAdjustText(text, id) {
        document.getElementById(`message-adjust-text-${id}`).textContent = text;
    }

    function highlightMessage(id) {
        document.getElementById(`message-${id}`).style.backgroundColor =
            "#fdf8ea";
        document.getElementById("pinned-message-holder").style.display =
            "block";
    }

    return user && currentChannel && allMessages ? (
        <>
            {Object.values(allMessages).map((message, ind) => (
                <div
                    key={message.id}
                    id={`message-${message.id}`}
                    className="message-card"
                >
                    <div>
                        <img
                            src={message.User?.avatar}
                            alt={`${message.User?.first_name} ${message.User?.last_name}`}
                            style={{
                                borderRadius: "5px",
                                width: "36px",
                                height: "36px",
                            }}
                        ></img>
                    </div>
                    <div className="message-card-content">
                        <div className="message-card-header">
                            <span
                                className="message-card-name"
                                onClick={(e) => alert("Feature coming soon!")}
                            >
                                {message.User?.first_name}{" "}
                                {message.User?.last_name}
                            </span>
                            <span className="message-card-time">
                                {new Date(
                                    message.updated_at
                                ).toLocaleTimeString([], {
                                    hour: "numeric",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                        <div className="message-card-makechangebox">
                            <span
                                id={`message-adjust-text-${message.id}`}
                                className="message-adjust-text"
                            ></span>
                            <span
                                onMouseOver={(e) =>
                                    changeAdjustText("Add Reaction", message.id)
                                }
                                onMouseOut={(e) =>
                                    changeAdjustText("", message.id)
                                }
                                className="message-adjust-reaction"
                            >
                                <i className="far fa-smile"></i>
                            </span>
                            <span
                                onMouseOver={(e) =>
                                    changeAdjustText("Pin Message", message.id)
                                }
                                onMouseOut={(e) =>
                                    changeAdjustText("", message.id)
                                }
                                className="message-adjust-pin"
                                onClick={(e) => alert("Feature coming soon!")}
                            >
                                <i className="far fa-dot-circle"></i>
                            </span>
                        </div>
                    </div>
                    <div>{message.content}</div>
                    {storeConverter(message, user)}
                </div>
            ))}
            <div className="editor">
                <div
                    style={{
                        backgroundColor: "#f2f2f2",
                        padding: "15px",
                        borderTop: "2px solid #dddddd",
                        borderLeft: "2px solid #dddddd",
                        borderRight: "2px solid #dddddd",
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px",
                    }}
                >
                    Bold | Italic | Strikethrough | etc.
                </div>
                <div>
                    <form onSubmit={sendChat}>
                        <input
                            style={{
                                backgroundColor: "#FFFFFF",
                                color: "#00000",
                                height: "60px",
                                padding: "15px",
                                borderBottom: "2px solid #dddddd",
                                borderLeft: "2px solid #dddddd",
                                borderRight: "2px solid #dddddd",
                                borderBottomLeftRadius: "12px",
                                borderBottomRightRadius: "12px",
                                width: "100%",
                            }}
                            value={chatInput}
                            onChange={updateChatInput}
                            placeholder={`Message # ${currentChannel.name}`}
                        />
                        <button hidden type="submit">
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </>
    ) : null;
};
export default Chat;
