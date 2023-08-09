import React, { useState, useEffect, useRef, Fragment, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    createChannelMessage,
    getChannelMessages,
    editMessage,
    thunkDeleteReaction,
    thunkCreateReaction,
    thunkDeleteAttachment
} from "../../../../store/messages";
import { useParams } from "react-router-dom";
import Editor from "../../../ChatTest/Editor";
import ReactionModal from "../../../ReactionModal";
import OpenModalButton from "../../../OpenModalButton";
import DeleteMessageModal from "../../../DeleteMessageModal"
import { isImage, previewFilter, getFileExt } from "./Attachments/AttachmentFncs";
import PreviewImageModal from "../../../PreviewImageModal/PreviewImageModal";
import SelectedUserRightBarContext from "../../../../context/SelectedUserRightBar/SelectedUserRightBarContext";
import MessageCard from "./MessageCard/MessageCard";
let updatedMessage;


const Messages = () => {
    let editing = false;
    const [, setSelectedUserRightBar] = useContext(SelectedUserRightBarContext);
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

    // hover functionality for attachments
    const [hoverId, setHoverId] = useState(0);


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

    // const handleDelete = (e, msg) => {
    //     dispatch(destroyMessage(msg.id));
    //     socket.emit("delete", { user: user.username, msg: msg.content });
    // };

    

    // const handleEdit = async (e, msg) => {
    //     document.getElementById("edit-msg-form").remove();
    //     e.preventDefault();
    //     await dispatch(
    //         editMessage(
    //             {
    //                 content: updatedMessage,
    //                 user_id: user.id,
    //                 channel_id: channelId,
    //                 is_pinned: false,
    //             },
    //             msg.id
    //         )
    //     );

    //     socket.emit("edit", {
    //         user: user.username,
    //         msg: updatedMessage,
    //         msg_id: msg.id,
    //     });
    // };

    function handleDeleteReaction(e, reaction) {
        e.preventDefault();
        dispatch(thunkDeleteReaction(reaction));
        socket.emit("deleteReaction", {
            user: user.username,
            reaction: reaction.reaction,
        });
    }
    function handleAddReaction(e, msg, rxn) {
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
                                msg.id
                            )
                        }
                    >
                        <p style={{ paddingRight: "5px" }}>{el[0]}</p> <p style={{ fontSize: '12px', color: "#333333" }}>{counts[el[0]].frequency}</p>
                    </button >
                ) : (
                    <button
                        style={{ padding: "0px 6px" }}
                        className="message-card-reaction"
                        onClick={(e) => handleAddReaction(e, msg, el[0])}
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

    function changeAdjustText(text, id) {
        document.getElementById(`message-adjust-text-${id}`).textContent = text;
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
        window.toggleLeftPane();
    }

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
        storeConverter
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
