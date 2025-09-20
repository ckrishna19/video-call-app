import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messageMap: {},
  messageList: [],
  loading: false,
  error: null,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    loadingMessageSlice: (state) => {
      state.loading = true;
    },
    errorMessageSlice: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    newMessageSlice: (state, { payload }) => {
      state.loading = false;
      state.error = null;
      console.log(state.messageList);
      state.messageList = [...state.messageList, payload];
    },
    clearMessageError: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  loadingMessageSlice,
  errorMessageSlice,
  clearMessageError,
  newMessageSlice,
  messageListSlice,
} = messageSlice.actions;

export default messageSlice.reducer;
