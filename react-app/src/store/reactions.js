// constants
const GET_REACTIONS = "session/GET_REACTIONS";
const CREATE_REACTION = "session/CREATE_REACTION";
const DELETE_REACTION = "session/DELETE_REACTION";



const getReactions = (reactions) => ({
    type: GET_REACTIONS,
    payload: reactions
});

const createReaction = (reaction) => ({
    type: CREATE_REACTION,
    payload: reaction
});

const deleteReaction = (reactionId) => ({
    type: DELETE_REACTION,
    payload: reactionId
});

export const thunkGetReactions = (message_id) => async (dispatch) => {
    const response = await fetch(`/api/messages/${message_id}/reactions`, {
        method: 'GET',
    });

    const data = await response.json();
    dispatch(getReactions(normalizeData(data.Reactions)));
    return response;
};

export const thunkCreateReaction = (message_id, new_reaction) => async (dispatch) => {
    const response = await fetch(`/api/messages/${message_id}/reactions`, {
        method: 'POST',
        body: new_reaction
    });

    const data = await response.json();
    dispatch(createReaction(data));
    return response;
};

export const thunkDeleteReaction = (reaction_id) => async (dispatch) => {
    const response = await fetch(`/api/reactions/${reaction_id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        await response.json();
        
        dispatch(deleteReaction(reaction_id));
    }
    
    return response;

};

const initialState = {};



export default function reactionReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case GET_REACTIONS:
            newState = Object.assign({}, state);
            newState = {};
            newState = action.payload;
            return newState;
        case CREATE_REACTION:
            newState = Object.assign({}, state);
            newState = {...state};
            newState[action.payload.id] = action.payload
            return newState;
        case DELETE_REACTION:
            delete state[action.payload]
            newState = Object.assign({}, state);
            newState = { ...state };
            return newState;
        default:
            return state;
    }
}

const normalizeData = (dataArr) => {
    const normalizeObj = {};
    dataArr.forEach(element => {
        normalizeObj[element.id] = element
    });

    return normalizeObj;

}