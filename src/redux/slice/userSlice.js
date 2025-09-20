import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  error: null,
  userList: [],
  userProfile: {},
  otp: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loadingUserSlice: (state) => {
      state.loading = true;
    },
    errorUserSlice: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    getMyProfile: (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.user = payload;
    },
    clearUserError: (state) => {
      state.loading = false;
      state.error = null;
    },
    userListSlice: (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.userList = payload;
    },
    getUserProfileSlice: (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.userProfile = payload;
    },
    logOutUserSlice: (state) => {
      state.loading = false;
      state.error = null;
      state.user = null;
      state.userProfile = null;
    },
    verifyOTPSlice: (state, { payload }) => {
      console.log(payload);
      state.error = null;
      state.loading = false;
      state.otp = payload;
    },
  },
});

export const {
  loadingUserSlice,
  errorUserSlice,
  getMyProfile,
  clearUserError,
  userListSlice,
  getUserProfileSlice,
  logOutUserSlice,
  verifyOTPSlice,
} = userSlice.actions;

export default userSlice.reducer;
