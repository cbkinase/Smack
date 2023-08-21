import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    getChannelMessages,
    editMessage,
    thunkDeleteAttachment,
    addMessage } from "../../../../store/messages";
import { useParams } from "react-router-dom";
import Editor from "../Editor/Editor";
import MessageCard from "./MessageCard/MessageCard";
import useInfiniteScrollingTop from "../../../../hooks/useInfiniteScrollingTop";

const Messages = ({ scrollContainerRef }) => {
    const { channelId } = useParams();
    const dispatch = useDispatch();
    const [chatInput, setChatInput] = useState("");
    const user = useSelector((state) => state.session.user);
    const allMessages = useSelector((state) => state.messages.allMessages);
    const currentChannel = useSelector((state) => state.channels.single_channel);
    const socket = useSelector((state) => state.session.socket);

    // buffer for actual attachments to be uploaded
    const [attachmentBuffer, setAttachmentBuffer] = useState({});
    const [attachmentIsLoading, setAttachmentIsLoading] = useState(false);

    // Variables for infinite scrolling
    const [page, setPage] = useInfiniteScrollingTop(scrollContainerRef);
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
    }, [dispatch, page, scrollContainerRef, hasMoreToLoad, channelId])

    // Handle adjusting the scroll position after the data has been fetched and rendered
    useEffect(() => {
        const newScrollHeight = scrollContainerRef.current.scrollHeight;
        const heightDifference = newScrollHeight - prevScrollHeight;

        scrollContainerRef.current.scrollTop += heightDifference;
    }, [scrollContainerRef, prevScrollHeight, allMessages]);

    function scrollToBottomOfGrid() {
        const element = document.getElementById("grid-content");
        if (element) element.scrollTop = element.scrollHeight;
    }

    useEffect(() => {
        async function alterChannelMessages() {
            await dispatch(getChannelMessages(channelId, 1, perPage));
            setHasMoreToLoad(true);
            setPage(1);
        }
        alterChannelMessages().then(() => scrollToBottomOfGrid());
    }, [dispatch, channelId]);


    useEffect(() => {
        if (!socket) return;

        socket.emit("join", {
            channel_id: channelId,
        });

        socket.on("chat", (chat) => {
            dispatch(addMessage(chat));
            scrollToBottomOfGrid();
        });

        socket.on("delete", (chat) => {
        });

        socket.on("edit", (chat) => {
            dispatch(addMessage(chat));
        });

        socket.on("deleteReaction", (reaction) => {
        });

        socket.on("addReaction", (reaction) => {
        });

        socket.on("deleteAttachment", (chat) => {
        });

        return () => {
            socket.off("deleteAttachment");
            socket.off("addReaction");
            socket.off("deleteReaction");
            socket.off("edit");
            socket.off("delete");
            socket.off("chat");
            socket.emit("leave", {
                channel_id: channelId,
            });
            socket.off("leave");
        }
    }, [socket, channelId, dispatch]);

    const updateChatInput = (e) => {
        setChatInput(e.target.value);
    };

    async function handleSendingAttachments(attachmentBuffer) {
        const attachmentsArr = Object.values(attachmentBuffer);
        const formData = new FormData();

        for (let i = 0; i < attachmentsArr.length; i++) {
            formData.append("attachmentsBuffer" + i, attachmentsArr[i]);
        }

        const uploadResponse = await fetch("/api/messages/attachments/upload", {
            method: "POST",
            body: formData,
        });

        const uploadData = await uploadResponse.json();

        if (uploadData.errors) {
            alert(uploadData.errors);
            return null;
        } else {
            return uploadData;
        }
    }

    const sendChat = async (e) => {
        e.preventDefault();
        let socketPayload = { msg: chatInput, channel_id: +channelId };

        if (Object.keys(attachmentBuffer).length > 0) {
            setAttachmentIsLoading(true);
            const uploadedFiles = await handleSendingAttachments(attachmentBuffer);
            setAttachmentIsLoading(false);
            socketPayload["attachments"] = uploadedFiles;
        }

        socket.emit("chat", socketPayload, (res) => {
            if (res.status === "success") {
                dispatch(addMessage(res.message));
                scrollToBottomOfGrid();
            } else {
                // TODO: handle message send failures
                // depending on specific failure point
                console.log("response: ", res);
                console.log("status: ", res.status);
            }
        });

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

    if (!user || !currentChannel || !allMessages) {
        return null;
    }

    return (
        <>
            <div style={{ marginBottom: '10px' }}>
                {Object.values(allMessages).map((message, ind) => (
                    <MessageCard key={message.id}
                                 message={message}
                                 user={user}
                                 socket={socket}
                                 dispatch={dispatch}
                                 messageFunctions={messageFunctions}
                    />
                ))}
            </div>

            <div style={{ position: 'sticky', bottom: 0 }} >
                <Editor functions={messageFunctions}
                        creating={true}
                        setChatInput={setChatInput}
                        user={user}
                        attachmentBuffer={attachmentBuffer}
                        attachmentIsLoading={attachmentIsLoading}
                />
            </div>
        </>
    )
};
export default Messages;
