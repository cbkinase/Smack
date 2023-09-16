const initialState = { all_channels: {}, user_channels: {}, single_channel: null }

const ALL_CHANNEL = 'channel/all';
const USER_CHANNELS = 'channel/user';
const GET_ONE_CHANNEL = 'channel/getone';
const ADD_CHANNEL = 'channel/add';
const EDIT_CHANNEL = 'channel/edit';
const DELETE_CHANNEL = 'channel/delete';

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
        return data
    }
    else {
        const data = await response.json();
        return data;
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
        return data
    }
    else {
        const failData = await response.json();
        return failData;
    }
}

const channelReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case ALL_CHANNEL:
            newState = { ...state, all_channels: {} };
            action.payload.all_channels.forEach((chnl) => {
                newState.all_channels[chnl.id] = chnl
            });
            return newState;
        case USER_CHANNELS:
            newState = { ...state, user_channels: {} };
            action.payload.user_channels.forEach((chnl) => {
                newState.user_channels[chnl.id] = chnl
            });
            return newState;
        case GET_ONE_CHANNEL:
            newState = { ...state, single_channel: { ...action.payload.single_channel } };
            return newState;
        case ADD_CHANNEL:
            newState = { ...state }
            newState.all_channels = { ...state.all_channels };
            newState.all_channels[action.payload.id] = action.payload;
            newState.user_channels = { ...state.user_channels };
            newState.user_channels[action.payload.id] = action.payload;
            return newState;
        case EDIT_CHANNEL:
            newState = { ...state }
            newState.all_channels = { ...state.all_channels };
            newState.all_channels[action.payload.id] = action.payload;
            newState.user_channels = { ...state.user_channels };
            newState.user_channels[action.payload.id] = action.payload;
            newState.single_channel = { ...state.single_channel };
            newState.single_channel.name = action.payload.name;
            newState.single_channel.subject = action.payload.subject;
            newState.single_channel.is_private = action.payload.is_private;
            newState.single_channel.is_direct = action.payload.is_direct;
            return newState;
        case DELETE_CHANNEL:
            newState = { ...state }
            newState.all_channels = { ...state.all_channels };
            delete newState.all_channels[action.id];
            newState.user_channels = { ...state.user_channels };
            delete newState.user_channels[action.id];
            newState.single_channel = null ;
            return newState;
        default:
            return state;
    }
}

export default channelReducer
