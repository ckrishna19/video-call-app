import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatMap: {},
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    loadingChatSlice: (state) => {
      state.loading = true;
    },
    createNewChatSlice: (state, { payload }) => {
      state.loading = false;
      state.error = null;
      const { roomId, newMessage } = payload;
      if (!state.chatMap[roomId]) {
        state.chatMap[roomId] = [];
      }
      state.chatMap[roomId] = [...state.chatMap[roomId], newMessage];
    },
    errorChatSlice: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    getAllChatSlice: (state, { payload }) => {
      state.loading = false;
      state.error = null;
      const { chatList, roomId } = payload;
      state.chatMap[roomId] = chatList;
    },
  },
});

export const {
  loadingChatSlice,
  createNewChatSlice,
  errorChatSlice,
  getAllChatSlice,
} = chatSlice.actions;

export default chatSlice.reducer;
