const LOAD_MESSAGES = "messages/LOAD_MESSAGES";
const ADD_MESSAGE = "messages/ADD_MESSAGE";
const DELETE_MESSAGE = "messages/DELETE_MESSAGE";

const addMessage = (message) => {
    return {
        type: ADD_MESSAGE,
        message,
    };
};

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

export const getChannelMessages = (id) => async (dispatch) => {
    const res = await fetch(`/api/channels/${id}/messages`);

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

export const destroyMessage = (id) => async (dispatch) => {
    const res = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
    });

    if (res.ok) {
        dispatch(deleteMessage(id));
    }
};

export const editMessage = (message, messageId) => async (dispatch) => {
    const res = await fetch(`/api/messages/${messageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(createChannelMessage(data));
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
            let msgs = Object.values(action.messages);
            let newState = {};
            msgs.forEach((msg) => {
                newState["allMessages"][msg.id] = msg;
            });
            return newState;
        }
        case DELETE_MESSAGE: {
            let newState = { ...state, allMessages: { ...state.allMessages } };
            delete newState.allMessages.action.id;
            return newState;
        }
        default:
            return state;
    }
};

export default messageReducer;
