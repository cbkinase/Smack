import { io } from "socket.io-client";

// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";
const ADJUST_USER = "session/ADJUST_USER";
const SET_SOCKET = "session/SET_SOCKET";
const REMOVE_SOCKET = "session/REMOVE_SOCKET";
const SET_ONLINE_USERS = "session/SET_ONLINE_USERS";
const REMOVE_ONLINE_USER = "session/REMOVE_ONLINE_USERS";
const ADD_ONLINE_USER = "session/ADD_ONLINE_USER";

const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});

const removeUser = () => ({
	type: REMOVE_USER,
});

const adjustUser = (user) => ({
	type: ADJUST_USER,
	payload: user,
});

const removeSocket = () => ({
	type: REMOVE_SOCKET,
});

export const setOnlineUsers = (userIds) => ({
	type: SET_ONLINE_USERS,
	payload: userIds,
});

export const addOnlineUser = (usr) => ({
	type: ADD_ONLINE_USER,
	payload: usr,
});

export const removeOnlineUser = (id) => ({
	type: REMOVE_ONLINE_USER,
	payload: id,
});

const initialState = { user: null, socket: null, onlineUsers: null };

export const disconnectWebSocket = () => async (dispatch) => {
	dispatch(removeSocket());
};

export const authenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/");
	if (response.ok) {
		const data = await response.json();
		dispatch(setUser(data));
		return data;
	}
};

export const login = (email, password) => async (dispatch) => {
	const response = await fetch("/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(setUser(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.error) {
			return data.message;
		}
	} else {
		return ["An error occurred. Please try again."];
	}
};

export const logout = () => async (dispatch) => {
	const response = await fetch("/api/auth/logout", {
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok) {
		dispatch(removeUser());
		dispatch(removeSocket());
	}
};

export const signUp =
	(username, email, password, first_name, last_name) => async (dispatch) => {
		const response = await fetch("/api/auth/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				email,
				password,
				first_name,
				last_name,
			}),
		});

		if (response.ok) {
			const data = await response.json();
			dispatch(setUser(data));
			return null;
		} else if (response.status < 500) {
			const data = await response.json();
			if (data.error) {
				return data.message;
			}
		} else {
			return ["An error occurred. Please try again."];
		}
	};

export const editUser =
	(first_name, last_name, avatar, bio, id) => async (dispatch) => {
		if (avatar === "") {
			avatar =
				"https://ca.slack-edge.com/T0266FRGM-UQ46QH94Z-gc24d346e359-512";
		}
		const response = await fetch(`/api/users/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				first_name,
				last_name,
				avatar,
				bio,
			}),
		});

		if (response.ok) {
			const data = await response.json();
			dispatch(adjustUser(data));
			return null;
		} else if (response.status < 500) {
			const data = await response.json();
			if (data.error) {
				return data.message;
			}
		} else {
			return ["An error occurred. Please try again."];
		}
	};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER:
			if (!state.socket) {
				return { user: action.payload, socket: io() };
			} else return { ...state, user: action.payload };
		case REMOVE_USER:
			return { ...state, user: null };
		case ADJUST_USER:
			return { ...state, user: action.payload };
		case REMOVE_SOCKET:
			if (state.socket) {
				state.socket.disconnect();
			}
			return { ...state, socket: null };
		case SET_SOCKET: {
			return { ...state, socket: action.payload };
		}
		case SET_ONLINE_USERS:
			return { ...state, onlineUsers: action.payload };
		case ADD_ONLINE_USER: {
			return {
				...state,
				onlineUsers: {
					...state.onlineUsers,
					[action.payload.id]: action.payload.status,
				},
			};
		}
		case REMOVE_ONLINE_USER: {
			const newState = {
				...state,
				onlineUsers: { ...state.onlineUsers },
			};
			delete newState.onlineUsers[action.payload];
			return newState;
		}
		default:
			return state;
	}
}
