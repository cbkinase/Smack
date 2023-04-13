const initialState = {channels: {all_channels: []}}

const ALL_CHANNEL = 'channel/all'
const USER_CHANNELS = 'channel/user'
const GET_ONE_CHANNEL = 'channel/getone'
const ADD_CHANNEL = 'channel/add'
const EDIT_CHANNEL = 'channel/edit'
const DELETE_CHANNEL = 'channel/delete'

export const UserChannel = (payload) => {
    return {
        type: USER_CHANNELS,
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
    const response = await fetch(`/api/channels/all`)

    if (response.ok) {
        const data = await response.json();
        dispatch(AllChannel(data));
    }
}

export const OneChannelThunk = (id) => async dispatch => {
    const response = await fetch(`/api/channels/${id}`)

    if (response.ok) {
        const data = await response.json();
        dispatch(OneChannel(data));
    }
}

export const UserChannelThunk = () => async dispatch => {
    const response = await fetch(`/api/channels/user`)

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
    const response = await fetch(`/api/channels/${id}`, {
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
    const response = await fetch('/api/channels/', {
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
            newState = { ...state, ...action.payload}
            return newState;
        case USER_CHANNELS:
            newState = { ...state, ...action.payload}
            return newState;
        case GET_ONE_CHANNEL:
            newState = { ...state, ...action.payload}
            return newState;
        case ADD_CHANNEL:
            newState = { ...state, channels: { ...state.channels, "all_channels": [action.payload]}}
            return newState;
        case EDIT_CHANNEL:
            newState = { ...state, channels: { ...state.channels, "all_channels": [action.payload]}}
            return newState
        case DELETE_CHANNEL:
            newState = {...state, channels: { ...state.channels, all_channels: [...state.channels.all_channels]}}
            newState.channels.all_channels = newState.channels.all_channels.filter(channel => channel.id !== action.id)
            return newState
        default:
            return state;
    }
}

export default channelReducer
