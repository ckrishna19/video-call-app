import {
  loadingChatSlice,
  getAllChatSlice,
  errorChatSlice,
} from "../slice/chatSlice";
import axios from "axios";
export const getAllChatAction = (url, roomId) => async (dispatch) => {
  dispatch(loadingChatSlice());

  try {
    const { data } = await axios.get(url, { withCredentials: true });

    dispatch(getAllChatSlice({ chatList: data?.data, roomId }));
  } catch (error) {
    dispatch(errorChatSlice(error?.response?.data?.message));
  }
};
