import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	loading: false,
	error: null,
	currentUser: null,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		signInStart: (state) => {
			state.loading = true;
			state.error = null;
		},

		signInSuccess: (state, action) => {
			state.currentUser = action.payload;
			state.loading = false;
			state.error = null;
		},

		signInFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		updateUserStart: (state) => {
			state.loading = true;
			state.error = null;
		},

		updateUserSuccess: (state, action) => {
			state.currentUser = action.payload;
			state.loading = false;
			state.error = null;
		},

		updateUserFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},

		deleteUserStart: (state) => {
			state.loading = true;
			state.error = null;
		},
		deleteUserSuccess: (state) => {
			state.currentUser = null;
			state.loading = false;
			state.error = null;
		},
		deleteUserFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		signoutSuccess: (state) => {
			state.currentUser = null;
			state.error = null;
			state.loading = false;
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	signInFailure,
	signInStart,
	signInSuccess,
	updateUserFailure,
	updateUserStart,
	updateUserSuccess,
	deleteUserFailure,
	deleteUserStart,
	deleteUserSuccess,
	signoutSuccess,
} = userSlice.actions;

export default userSlice.reducer;
