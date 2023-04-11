const initialState = {}

const ALL_CHANNEL = 'channel/all'
const USER_CHANNEL = 'channel/user'
const GET_ONE_CHANNEL = 'channel/getone'
const ADD_CHANNEL = 'channel/add'
const EDIT_CHANNEL = 'channel/edit'
const DELETE_CHANNEL = 'channel/delete'

export const UserChannel = (payload) => {
    return {
        type: USER_CHANNEL,
        payload
    }
}

export const OneChannel = (payload) => {
    return {
        type: GET_ONE_CHANNEL,
        payload
    }
}

export const AddChannel = (payload) => {
    return {
        type: ADD_CHANNEL,
        payload
    }
}

export const EditChannel = (payload) => {
    return {
        type: EDIT_CHANNEL,
        payload
    }
}

export const AllChannel = (payload) => {
    return {
        type: ALL_CHANNEL,
        payload
    }
}

export const DeleteChannel = (id) => {
    return {
        type: DELETE_CHANNEL,
        id
    }
}

export const AllChannelThunk = () => async dispatch => {
    const response = await csrfFetch(`/api/channels/all`)

    if (response.ok) {
        const data = await response.json();
        dispatch(AllChannel(data));
    }
}

export const OneChannelThunk = (id) => async dispatch => {
    const response = await csrfFetch(`/api/channels/${id}`)

    if (response.ok) {
        const data = await response.json();
        dispatch(OneChannel(data));
    }
}

export const UserChannelThunk = () => async dispatch => {
    const response = await csrfFetch(`/api/channels/user`)

    if (response.ok) {
        const data = await response.json();
        dispatch(UserChannel(data));
    }
}

export const EditChannelThunk = (id, body) => async dispatch => {
    const response = await fetch(`/api/channels/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    if (response.ok) {
        const data = await response.json();
        dispatch(EditChannel(data))
    }
}

export const DeleteChannelThunk = (id) => async dispatch => {
    const response = await csrfFetch(`/api/channels/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (response.ok) {
        dispatch(DeleteChannel(id))
    }
}

export const AddChannelThunk = (value) => async dispatch => {
    const response = await csrfFetch('/api/groups', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(value)
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(AddChannel(data))
    }
}

const channelReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case ALL_CHANNEL:
            newState = Object.assign({}, state);
            newState.all_channels = action.payload;
            return newState;
        case USER_CHANNEL:
            newState = Object.assign({}, state);
            newState.user_channels = action.payload;
            return newState;
        case GET_ONE_CHANNEL:
            newState = Object.assign({}, state);
            newState.single_channel = action.payload;
            return newState;
        case DELETE_CHANNEL:
            newState = Object.assign({}, state);
            delete newState.channels.all_channels[action.id]
            if (Object.keys(newState.channels.user_channels).includes(action.payload.id)) {
                delete newState.channels.user_channels[action.payload.id]
            }
            if (Object.keys(newState.channels.single_channel).includes(action.payload.id)) {
                delete newState.channels.single_channel[action.payload.id]
            }
            return newState
        case EDIT_CHANNEL:
            newState = Object.assign({}, state)
            newState.channels.all_channels[action.payload.id] = action.payload
            if (Object.keys(newState.channels.user_channels).includes(action.payload.id)) {
                newState.channels.user_channels[action.payload.id] = action.payload
            }
            if (Object.keys(newState.channels.single_channel).includes(action.payload.id)) {
                newState.channels.single_channel = action.payload
            }
            return newState    
        case ADD_CHANNEL:
            newState = Object.assign({}, state)
            newState.channels.all_channels[action.payload.id] = action.payload
            newState.channels.user_channels[action.payload.id] = action.payload
            newState.channels.single_channel = action.payload
            return newState;
    }
}

export default channelReducer