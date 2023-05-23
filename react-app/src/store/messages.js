const LOAD_MESSAGES = "messages/LOAD_MESSAGES";
const ADD_MESSAGE = "messages/ADD_MESSAGE";
const DELETE_MESSAGE = "messages/DELETE_MESSAGE";
const DELETE_REACTION = "messages/DELETE_REACTION";
const ADD_REACTION = "messages/ADD_REACTION";
const DELETE_ATTACHMENT = "messages/DELETE_ATTACHMENT";

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

const deleteAttachment = (attachment) => ({
    type: DELETE_ATTACHMENT,
    payload: attachment,
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

export const createChannelMessage = (message, channel_id) => async (dispatch) => {
    const resMessage = await fetch(`/api/channels/${channel_id}`, {
        method: "POST",
        body: message,
    });

    if (resMessage.ok) {
        const data = await resMessage.json();

        if (data.errors) {
            return data;
        }

        dispatch(addMessage(data));
        return data;
    }

    // if (resMessage.ok) {
    //     const message = await resMessage.json();
    //     dispatch(addMessage(message));
    //     return message;
    // }
};

export const thunkCreateReaction =
    (message_id, new_reaction) => async (dispatch) => {
        const response = await fetch(`/api/messages/${message_id}/reactions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(new_reaction),
        });

        if(response.ok) {
        const data = await response.json();
            if(data.errors) return data;
        dispatch(createReaction(data));
        return response;
        }
        else {
            return response;
        }
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

export const thunkDeleteAttachment = (attachment) => async (dispatch) => {
    const response = await fetch(`/api/messages/attachments/${attachment.id}`, {
        method: "DELETE",
    });

    if (response.ok) {
        await response.json();

        dispatch(deleteAttachment(attachment));
    }

    return response;
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
        case DELETE_ATTACHMENT: {
            let newState = {
                ...state,
                allMessages: {
                    ...state.allMessages,
                },
            };
            delete newState.allMessages[action.payload.message_id].Attachments[
                action.payload.id
            ];
            return newState;
        }
        default:
            return state;
    }
};

export default messageReducer;
