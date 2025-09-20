import {
  errorMessageSlice,
  loadingMessageSlice,
  messageListSlice,
} from "../slice/messageSlice";
import axios from "axios";
export const getAllMessageAction = (url, receivedBy) => async (dispatch) => {
  dispatch(loadingMessageSlice());
  try {
    const { data } = await axios.get(url, { withCredentials: true });
    if (data.statusCode === 201) {
      dispatch(messageListSlice({ messageList: data?.data, receivedBy }));
    }
  } catch (error) {
    dispatch(errorMessageSlice(error?.response?.data?.message));
  }
};
