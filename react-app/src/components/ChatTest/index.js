import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io } from 'socket.io-client';
import { createChannelMessage, getChannelMessages } from "../../store/messages";
import { useParams } from "react-router-dom";
let socket;

const Chat = () => {
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([]);
    const user = useSelector(state => state.session.user)
    const dispatch = useDispatch()
    const allMessages = useSelector(state => state.messages.allMessages)
    const { channelId } = useParams()

    useEffect(() => {
        dispatch(getChannelMessages(channelId))
    }, [dispatch])

    useEffect(() => {
        // open socket connection
        // create websocket
        socket = io();

        socket.on("chat", (chat) => {
            setMessages(messages => [...messages, chat])
        })
        // when component unmounts, disconnect
        return (() => {
            socket.disconnect()
        })
    }, [])

    const updateChatInput = (e) => {
        setChatInput(e.target.value)
    };

    const sendChat = async (e) => {
        e.preventDefault()
        socket.emit("chat", { user: user.username, msg: chatInput });
        const newMessage = {
            user_id: user.id,
            channel_id: channelId,
            content: chatInput
        }
        await dispatch(createChannelMessage(newMessage))
        setChatInput("")
    }

    return (user && (
        <div>
            <div>
                {Object.values(allMessages).map((message, ind) => (
                    <div key={ind}>{`USER ID: ${message.user_id}: ${message.content}`}</div>
                ))}
            </div>
            <form onSubmit={sendChat}>
                <input
                    value={chatInput}
                    onChange={updateChatInput}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    )
    )
};


export default Chat;
