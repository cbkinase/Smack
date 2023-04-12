import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import {
    createChannelMessage,
    getChannelMessages,
    editMessage,
    destroyMessage,
} from "../../store/messages";
import { useParams } from "react-router-dom";
let socket;

const Chat = () => {
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([]);
    const user = useSelector((state) => state.session.user);
    const dispatch = useDispatch();
    const allMessages = useSelector((state) => state.messages.allMessages);
    const { channelId } = useParams();

    useEffect(() => {
        dispatch(getChannelMessages(channelId));
    }, [dispatch, messages, channelId]);

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
            console.log("hi");
            let messageIdx = messages.findIndex(
                (msg) => msg.id === chat.msg_id
            );
            console.log(messages, chat);
            messages[messageIdx] = chat;
            let newMessages;
            setMessages(newMessages);
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
