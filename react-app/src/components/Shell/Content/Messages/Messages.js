import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    createChannelMessage,
    getChannelMessages,
    editMessage,
    thunkDeleteAttachment
} from "../../../../store/messages";
import { useParams } from "react-router-dom";
import Editor from "../../../ChatTest/Editor";
import MessageCard from "./MessageCard/MessageCard";
import useInfiniteScrollingTop from "../../../../hooks/useInfiniteScrollingTop";


const Messages = ({ scrollContainerRef }) => {
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [reactions, setReactions] = useState([]);
    const user = useSelector((state) => state.session.user);
    const dispatch = useDispatch();
    const allMessages = useSelector((state) => state.messages.allMessages);
    const { channelId } = useParams();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const socket = useSelector(state => state.session.socket);

    // buffer for actual attachments to be uploaded
    const [attachmentBuffer, setAttachmentBuffer] = useState({});
    const [attachmentIsLoading, setAttachmentIsLoading] = useState(false);

    // Variables for infinite scrolling
    const page = useInfiniteScrollingTop(scrollContainerRef);
    const perPage = 25;
    const [prevScrollHeight, setPrevScrollHeight] = useState(0);
    const [hasMoreToLoad, setHasMoreToLoad] = useState(true);

    // Effect for infinite scrolling
    useEffect(() => {
        // Keep track of scroll height before getting new data
        const currentScrollHeight = scrollContainerRef.current.scrollHeight;
        setPrevScrollHeight(currentScrollHeight);

        (async function() {
            if (!hasMoreToLoad) return;
            const res = await dispatch(getChannelMessages(channelId, page, perPage));
            if (res.errors) {
                setHasMoreToLoad(false);
            }
        })()
    }, [dispatch, page, scrollContainerRef, hasMoreToLoad])

    // Handle adjusting the scroll position after the data has been fetched and rendered
    useEffect(() => {
        const newScrollHeight = scrollContainerRef.current.scrollHeight;
        const heightDifference = newScrollHeight - prevScrollHeight;

        scrollContainerRef.current.scrollTop += heightDifference;
    }, [scrollContainerRef, prevScrollHeight, allMessages]);


    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("click", closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const currentChannel = useSelector(
        (state) => state.channels.single_channel
    );

    function scrollToBottomOfGrid() {
        const element = document.getElementById("grid-content");
        if (element) element.scrollTop = element.scrollHeight;
    }

    // Gives us a way to see which part(s) of
    // the dependency array actually changed
    // so we can act on this conditionally
    const prevMessagesRef = useRef();
    const prevChannelIdRef = useRef();

    useEffect(() => {
        const prevMessages = prevMessagesRef.current;
        const prevChannelId = prevChannelIdRef.current;
        async function alterChannelMessages() {
            await dispatch(getChannelMessages(channelId));
            if (prevMessages !== messages || prevChannelId !== channelId) {
                // Run when `messages` or `channelId` is the changed dependency
                scrollToBottomOfGrid();
            }
        }
        alterChannelMessages();
        prevMessagesRef.current = messages;
        prevChannelIdRef.current = channelId;
    }, [dispatch, messages, reactions, channelId]);


    useEffect(() => {
        if (!socket) return;

        socket.emit("join", {
            channel_id: channelId,
            username: user.username,
        });

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
            // console.log(reactions);
        });

        socket.on("deleteAttachment", (chat) => {
            setMessages([]);
        });

        return () => {
            socket.off("deleteAttachment");
            socket.off("addReaction");
            socket.off("deleteReaction");
            socket.off("edit");
            socket.off("delete");
            socket.off("chat");
        }

    },
    // [socket, channelId, messages, reactions, user.username]
    [socket]
    );

    const updateChatInput = (e) => {
        setChatInput(e.target.value);
    };



    const sendChat = async (e) => {
        e.preventDefault();
        const attachmentsArr = Object.values(attachmentBuffer)
        const formData = new FormData();
        formData.append("content", chatInput);
        for(let i = 0; i < attachmentsArr.length; i++) {
            formData.append("attachmentsBuffer"+i, attachmentsArr[i])
        }
        // console.log("FORM SENDING: ", formData.get("attachmentsBuffer0"));
        // console.log("FORM SENDING: ", formData.get("attachmentsBuffer1"));
        // const newMessage = {
        //     user_id: user.id,
        //     channel_id: channelId,
        //     content: chatInput,
        // };
        setAttachmentIsLoading(true)
        await dispatch(createChannelMessage(formData, channelId));
        setAttachmentIsLoading(false)
        socket.emit("chat", { user: user.username, msg: chatInput });

        setAttachmentBuffer({});
        setChatInput("");
    };


    // Attachments
    // add each attachment to buffer, buffer will be used when uploading
    const addAttachBuffer = (e) => {
        if (e.target.files[0]) {
            const curBuffer = { ...attachmentBuffer };
            let currId = 0;

            if (!Object.values(curBuffer).length) {
                currId = 1;
            }
            else {
                currId = Object.values(curBuffer).pop().id + 1;
            }

            const file = e.target.files[0];
            file["id"] = currId;

            curBuffer[currId] = file;
            setAttachmentBuffer(curBuffer);
        }


    }

    // remove attachment from buffer
    const removeAttachBuffer = (e, id) => {
        e.preventDefault();

        const curBuffer = { ...attachmentBuffer };
        delete curBuffer[id];
        setAttachmentBuffer(curBuffer);

    }

    // delete attachment
    const handleDeleteAttachment = async (e, msgId, attachment) => {
        e.preventDefault();
        await dispatch(thunkDeleteAttachment(attachment))
        socket.emit("deleteAttachment", { user: user.username, msgId: msgId });
    }

    const messageFunctions = {
        sendChat,
        chatInput,
        updateChatInput,
        currentChannel,
        channelId,
        addAttachBuffer,
        removeAttachBuffer,
        handleDeleteAttachment,
        editMessage,
    };

    return user && currentChannel && allMessages ? (
        <>

            <div style={{ marginBottom: '10px' }}>

                {Object.values(allMessages).map((message, ind) => (

                    <MessageCard key={ind}
                                 message={message}
                                 user={user}
                                 socket={socket}
                                 dispatch={dispatch}
                                 messageFunctions={messageFunctions}
                    />


                ))}

            </div>


            <div style={{ position: 'sticky', bottom: 0 }} >
                <Editor functions={messageFunctions} creating={true} setChatInput={setChatInput} user={user} attachmentBuffer={attachmentBuffer} attachmentIsLoading={attachmentIsLoading}/>
            </div>


        </>
    ) : null;
};
export default Messages;
