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
	},
});

// Action creators are generated for each case reducer function
export const { signInFailure, signInStart, signInSuccess } = userSlice.actions;

export default userSlice.reducer;
