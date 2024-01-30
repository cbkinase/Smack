import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	getChannelMessages,
	addMessage,
	deleteMessage,
	createReaction,
	deleteReaction,
	deleteAttachment,
} from "../../../../store/messages";
import { useParams } from "react-router-dom";
import Editor from "../Editor/Editor";
import MessageCard from "./MessageCard/MessageCard";
import useInfiniteScrollingTop from "../../../../hooks/useInfiniteScrollingTop";
import scrollToBottomOfGrid from "../../../../utils/scrollToBottomOfGrid";
import useViewportWidth from "../../../../hooks/useViewportWidth";
import { toggleLeftPane } from "../../../../utils/togglePaneFunctions";
import LoadingSpinner from "../../../LoadingSpinner";
import MessageBeginning from "./MessageIntro/MessageBeginning";

const Messages = ({ scrollContainerRef }) => {
	const { channelId } = useParams();
	const dispatch = useDispatch();
	const [chatInput, setChatInput] = useState("");
	const user = useSelector((state) => state.session.user);
	const allMessages = useSelector((state) => state.messages.allMessages);
	const currentChannel = useSelector(
		(state) => state.channels.single_channel,
	);
	const socket = useSelector((state) => state.session.socket);
	const [isLoaded, setIsLoaded] = useState(false);

	// For improved responsiveness - particularly on load
	const viewportWidth = useViewportWidth();
	useEffect(() => {
		if (isLoaded) {
			toggleLeftPane();
		}
	}, [viewportWidth, isLoaded]);

	// buffer for actual attachments to be uploaded
	const [attachmentBuffer, setAttachmentBuffer] = useState({});
	const [attachmentIsLoading, setAttachmentIsLoading] = useState(false);

	// Variables for infinite scrolling
	const [page, setPage] = useInfiniteScrollingTop(scrollContainerRef);
	const perPage = 25;
	const [prevScrollHeight, setPrevScrollHeight] = useState(0);
	const [hasMoreToLoad, setHasMoreToLoad] = useState(true);
	const [loadedMore, setLoadedMore] = useState(false);

	// Effect for infinite scrolling
	useEffect(() => {
		if (!isLoaded || page === 1) return;

		// Keep track of scroll height before getting new data
		const currentScrollHeight = scrollContainerRef.current.scrollHeight;
		setPrevScrollHeight(currentScrollHeight);

		(async function () {
			if (!hasMoreToLoad) return;
			const res = await dispatch(
				getChannelMessages(channelId, page, perPage),
			);
			setLoadedMore(true);
			if (res.error) {
				setHasMoreToLoad(false);
			}
		})();
	}, [
		dispatch,
		page,
		scrollContainerRef,
		hasMoreToLoad,
		channelId,
		isLoaded,
	]);

	// Handle adjusting the scroll position after the data has been fetched and rendered
	useEffect(() => {
		if (!loadedMore) return;

		const newScrollHeight = scrollContainerRef.current.scrollHeight;
		const heightDifference = newScrollHeight - prevScrollHeight;

		scrollContainerRef.current.scrollTop += heightDifference;
		setLoadedMore(false);
	}, [scrollContainerRef, prevScrollHeight, loadedMore]);

	// Load new channel messages on changing channel
	useEffect(() => {
		async function loadInitialChannelMessages() {
			const msgs = await dispatch(
				getChannelMessages(channelId, 1, perPage),
			);
			setHasMoreToLoad(true);
			setIsLoaded(true);
			if (msgs.length < perPage) setHasMoreToLoad(false);
		}
		loadInitialChannelMessages();
		return () => {
			setPage(1);
		};
	}, [dispatch, channelId, setPage]);

	useEffect(() => {
		scrollToBottomOfGrid();
	}, [isLoaded]);

	useEffect(() => {
		if (!socket) return;

		socket.on("chat", async (chat) => {
			// Ensure UI updates before trying to scroll
			await dispatch(addMessage(chat));
			// We may only want to do this when a user is already at the bottom.
			// Then, if they're reading old messages, they won't be 'interrupted'
			scrollToBottomOfGrid();
		});

		socket.on("delete", (chatId) => {
			if (allMessages[chatId] !== undefined) {
				dispatch(deleteMessage(chatId));
			}
		});

		socket.on("edit", (chat) => {
			if (allMessages[chat.id] !== undefined) {
				dispatch(addMessage(chat));
			}
		});

		socket.on("addReaction", (reaction) => {
			if (allMessages[reaction.message_id] !== undefined) {
				dispatch(createReaction(reaction));
			}
		});

		socket.on("deleteReaction", (reaction) => {
			if (allMessages[reaction.message_id] !== undefined) {
				dispatch(deleteReaction(reaction));
			}
		});

		socket.on("deleteAttachment", (attachment) => {
			if (allMessages[attachment.message_id] !== undefined) {
				dispatch(deleteAttachment(attachment));
			}
		});

		return () => {
			socket.off("deleteAttachment");
			socket.off("deleteReaction");
			socket.off("addReaction");
			socket.off("edit");
			socket.off("delete");
			socket.off("chat");
		};
	}, [socket, dispatch, allMessages]);

	// Joining and type indicator stuff
	const [typingUsers, setTypingUsers] = useState({});

	useEffect(() => {
		if (!socket) return;

		socket.emit("join", {
			channel_id: channelId,
			user_id: user.id,
		});

		// If the user switches channels, stop the typing indicator on their current channel
		return () => {
			socket.emit("stopped_typing", {
				channel_id: channelId,
				user_id: user.id,
			});
			setTypingUsers({});
			socket.emit("leave", {
				channel_id: channelId,
				user_id: user.id,
			});
			setIsLoaded(false);
		};
	}, [channelId, user.id, socket]);

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

		if (uploadData.error) {
			alert(uploadData.error);
			return null;
		} else {
			return uploadData;
		}
	}

	const sendChat = async (e) => {
		e.preventDefault();
		const socketPayload = { msg: chatInput, channel_id: +channelId };

		if (Object.keys(attachmentBuffer).length > 0) {
			setAttachmentIsLoading(true);
			const uploadedFiles =
				await handleSendingAttachments(attachmentBuffer);
			setAttachmentIsLoading(false);
			socketPayload.attachments = uploadedFiles;
		}

		socket.emit("chat", socketPayload, async (res) => {
			if (res.status === "success") {
				await dispatch(addMessage(res.message));
				scrollToBottomOfGrid();
			} else {
				// TODO: handle message send failures
				// depending on specific failure point
				if (process.node.ENV !== "production") {
					console.log("response: ", res);
					console.log("status: ", res.status);
				}
			}
		});

		setAttachmentBuffer({});
		setChatInput("");

		socket.emit("stopped_typing", {
			channel_id: channelId,
			user_id: user.id,
		});
	};

	// Attachments

	// add each attachment to buffer, buffer will be used when uploading
	const addAttachBuffer = (e) => {
		if (e.target.files[0]) {
			const curBuffer = { ...attachmentBuffer };
			const file = e.target.files[0];
			let currId = 0;
			const CUTOFF_NUMBER = 20;
			const FILE_CUTOFF_SIZE = CUTOFF_NUMBER * 1024 * 1024; // Expressed in MB

			if (file.size >= FILE_CUTOFF_SIZE) {
				alert(
					`Sorry, the maximum attachment size is currently ${CUTOFF_NUMBER} MB.`,
				);
				return;
			}

			if (!Object.values(curBuffer).length) {
				currId = 1;
			} else {
				currId = Object.values(curBuffer).pop().id + 1;
			}

			file.id = currId;

			curBuffer[currId] = file;
			setAttachmentBuffer(curBuffer);
		}
	};

	// remove attachment from buffer
	const removeAttachBuffer = (e, id) => {
		e.preventDefault();

		const curBuffer = { ...attachmentBuffer };
		delete curBuffer[id];
		setAttachmentBuffer(curBuffer);
	};

	// delete attachment
	const handleDeleteAttachment = async (e, msg, attachment) => {
		e.preventDefault();
		const socketPayload = {
			channel_id: msg.channel_id,
			id: attachment.id,
			message_id: msg.id,
		};
		socket.emit("deleteAttachment", socketPayload, (res) => {
			if (res.status === "success") {
				dispatch(deleteAttachment(attachment));
			} else {
				if (process.env.NODE_ENV !== "production") {
					console.log(res);
				}
			}
		});
	};

	const messageFunctions = {
		sendChat,
		updateChatInput,
		currentChannel,
		channelId,
		addAttachBuffer,
		removeAttachBuffer,
		handleDeleteAttachment,
	};

	if (!isLoaded) {
		return <LoadingSpinner />;
	}

	return (
		<>
			<div style={{ marginBottom: "10px" }}>
				{hasMoreToLoad ? null : (
					<MessageBeginning channel={currentChannel} user={user} />
				)}

				{Object.values(allMessages).map((message) => (
					<MessageCard
						key={message.id}
						message={message}
						user={user}
						socket={socket}
						dispatch={dispatch}
						messageFunctions={messageFunctions}
					/>
				))}
			</div>

			<div id="editor-container">
				<Editor
					functions={messageFunctions}
					creating={true}
					setChatInput={setChatInput}
					user={user}
					attachmentBuffer={attachmentBuffer}
					attachmentIsLoading={attachmentIsLoading}
					chatInput={chatInput}
					typingUsers={typingUsers}
					setTypingUsers={setTypingUsers}
				/>
			</div>
		</>
	);
};
export default Messages;
