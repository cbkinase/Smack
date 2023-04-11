import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as reactionActions from '../../store/reactions'

function ReactionTestPage() {
    const dispatch = useDispatch();
    // const sessionUser = useSelector((state) => state.session.user);
    const reactions = useSelector((state) => state.reactions)

    let message_id = 5;

    useEffect(() => {
        dispatch(reactionActions.thunkGetReactions(message_id));

    }, [dispatch, message_id])

    const allReactionsArr = Object.values(reactions);

    return (
        <>
            <h1>Welcome to Reactions Test</h1>
            {allReactionsArr.map((reaction) => (
                <div>
                    <div>Message id: {`${reaction.message_id}`}</div>
                    <div>{reaction.reaction}</div>
                </div>
                
            ))}
            
        </>
    );
}

export default ReactionTestPage;
