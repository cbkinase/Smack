import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as reactionActions from '../../store/reactions'
import Emoji from "./Emoji";

function ReactionTestPage() {
    const dispatch = useDispatch();
    // const sessionUser = useSelector((state) => state.session.user);
    const reactions = useSelector((state) => state.reactions)

    let message_id = 2;

    useEffect(() => {
        dispatch(reactionActions.thunkGetReactions(message_id));

    }, [dispatch, message_id])

    const deleteHandler = (e, id) => {
        e.preventDefault();
        return dispatch(reactionActions.thunkDeleteReaction(id))

    }

    const allReactionsArr = Object.values(reactions);

    return (
        <>
            <h1>Welcome to Reactions Test</h1>
            {allReactionsArr.map((reaction) => (
                <div>
                    <div>Message id: {`${reaction.message_id}`}</div>
                    <div>{reaction.User.username}</div>
                    <div>{reaction.reaction}</div>
                    <button onClick={(e) => deleteHandler(e, reaction.id)}>Delete</button>
                </div>

            ))}
            <h2>EMOJI TEST BOIZ</h2>
            <div>
                <Emoji symbol="🤫" />
                <Emoji symbol="✨" />
                <Emoji symbol="🐑" />
                <Emoji symbol="✨" />

            </div>

        </>
    );
}

export default ReactionTestPage;