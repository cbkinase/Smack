import { Fragment } from "react";
import {
	deleteReaction,
	createReaction,
} from "../../../../../../store/messages";

function handleDeleteReaction(e, reaction, dispatch, socket, msg) {
	e.preventDefault();
	const socketPayload = {
		id: reaction.id,
		channel_id: msg.channel_id,
		message_id: msg.id,
	};

	socket.emit("deleteReaction", socketPayload, (res) => {
		if (res.status === "success") {
			dispatch(deleteReaction(res.payload));
		} else {
			if (process.env.NODE_ENV !== "production") {
				console.log(res);
			}
		}
	});
}

function handleAddReaction(e, msg, rxn, dispatch, socket) {
	e.preventDefault();

	const socketPayload = {
		message_id: msg.id,
		channel_id: msg.channel_id,
		reaction: rxn,
		id: rxn.id,
	};

	socket.emit("addReaction", socketPayload, (res) => {
		if (res.status === "success") {
			dispatch(createReaction(res.payload));
		} else {
			if (process.env.NODE_ENV !== "production") {
				console.log(res);
			}
		}
	});
}

function hasUserReacted(message, user, reaction) {
	// Define logic for seeing whether
	// A user has posted a given reaction
	// To a given message
	const userReaction = Object.values(message.Reactions).filter(
		(rxn) => rxn.user_id === user.id && rxn.reaction === reaction,
	);
	if (!userReaction.length) return null;
	return userReaction[0];
}

export default function storeConverter(msg, user, dispatch, socket) {
	if (!msg.Reactions) return null;
	const arr = Object.values(msg.Reactions);
	const emojiStuff = arr.map((el) => [el.reaction, el.id]);
	const counts = {};

	for (const num of emojiStuff) {
		if (!counts[num[0]]) {
			const countObj = {
				frequency: 1,
				reaction_ids: [num[1]],
			};

			counts[num[0]] = countObj;
			continue;
		}

		counts[num[0]].frequency++;
		counts[num[0]].reaction_ids.push(num[1]);
	}

	const countEntries = Object.entries(counts);

	return countEntries.map((el) => (
		<Fragment key={el[0]}>
			{hasUserReacted(msg, user, el[0]) ? (
				<button
					style={{
						padding: "0px 6px",
						backgroundColor: "#e7f3f9",
						border: "1px solid #bad3f2",
					}}
					className="message-card-reaction"
					onClick={(e) =>
						handleDeleteReaction(
							e,
							hasUserReacted(msg, user, el[0]),
							dispatch,
							socket,
							msg,
						)
					}
				>
					<p style={{ paddingRight: "5px" }}>{el[0]}</p>{" "}
					<p style={{ fontSize: "12px", color: "#333333" }}>
						{counts[el[0]].frequency}
					</p>
				</button>
			) : (
				<button
					style={{ padding: "0px 6px" }}
					className="message-card-reaction"
					onClick={(e) =>
						handleAddReaction(e, msg, el[0], dispatch, socket, user)
					}
				>
					{el[0]}{" "}
					<span className="message-card-reaction-count">
						<p style={{ paddingRight: "5px" }}>
							{counts[el[0]].frequency}
						</p>
					</span>
				</button>
			)}
		</Fragment>
	));
}
