const LOAD_MESSAGES = "messages/LOAD_MESSAGES";
const ADD_MESSAGE = "messages/ADD_MESSAGE";
const DELETE_MESSAGE = "messages/DELETE_MESSAGE";
const DELETE_REACTION = "messages/DELETE_REACTION";
const ADD_REACTION = "messages/ADD_REACTION";

const addMessage = (message) => {
    return {
        type: ADD_MESSAGE,
        message,
    };
};

const createReaction = (reaction) => ({
    type: ADD_REACTION,
    payload: reaction,
});

const loadMessages = (messages) => {
    return {
        type: LOAD_MESSAGES,
        messages,
    };
};

const deleteMessage = (id) => {
    return {
        type: DELETE_MESSAGE,
        id,
    };
};

const deleteReaction = (reaction) => ({
    type: DELETE_REACTION,
    payload: reaction,
});

export const getChannelMessages = (id) => async (dispatch) => {
    const res = await fetch(`/api/channels/${id}/messages`, {
        method: "GET",
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(loadMessages(data));
        return data;
    }
};

export const createChannelMessage = (message) => async (dispatch) => {
    const resMessage = await fetch(`/api/channels/${message.channel_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
    });

    if (resMessage.ok) {
        const message = await resMessage.json();
        dispatch(addMessage(message));
        return message;
    }
};

export const thunkCreateReaction =
    (message_id, new_reaction) => async (dispatch) => {
        const response = await fetch(`/api/messages/${message_id}/reactions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(new_reaction),
        });

        const data = await response.json();
        dispatch(createReaction(data));
        return response;
    };

export const destroyMessage = (id) => async (dispatch) => {
    const res = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
    });

    if (res.ok) {
        dispatch(deleteMessage(id));
    }
};

export const thunkDeleteReaction = (reaction) => async (dispatch) => {
    const response = await fetch(`/api/reactions/${reaction.id}`, {
        method: "DELETE",
    });

    if (response.ok) {
        await response.json();

        dispatch(deleteReaction(reaction));
    }

    return response;
};

export const editMessage = (message, messageId) => async (dispatch) => {
    const res = await fetch(`/api/messages/${messageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(addMessage(data));
        return data;
    }
};

const initialState = { allMessages: {} };

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_MESSAGE: {
            return {
                ...state,
                allMessages: {
                    ...state.allMessages,
                    [action.message.id]: action.message,
                },
            };
        }
        case LOAD_MESSAGES: {
            let newState = { allMessages: {} };
            action.messages.forEach((msg) => {
                newState["allMessages"][msg.id] = msg;
            });
            return newState;
        }
        case DELETE_MESSAGE: {
            let newState = { ...state, allMessages: { ...state.allMessages } };
            delete newState.allMessages[action.id];
            return newState;
        }
        case DELETE_REACTION: {
            let newState = {
                ...state,
                allMessages: {
                    ...state.allMessages,
                },
            };
            delete newState.allMessages[action.payload.message_id].Reactions[
                action.payload.id
            ];
            return newState;
        }
        case ADD_REACTION: {
            // let newState = Object.assign({}, state);
            // newState.allMessages = { ...state.allMessages };
            // newState.allMessages.Reactions = { ...state.allMessages.Reactions };
            // newState.allMessages.Reactions[action.payload.id] = action.payload;
            // return newState;

            let newState = {
                ...state,
                allMessages: {
                    ...state.allMessages,
                },
            };
            newState.allMessages[action.payload.message_id].Reactions[
                action.payload.id
            ] = action.payload;
            return newState;
        }
        default:
            return state;
    }
};

export default messageReducer;
