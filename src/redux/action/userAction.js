import {
  loadingUserSlice,
  errorUserSlice,
  userListSlice,
  getUserProfileSlice,
  logOutUserSlice,
} from "../slice/userSlice";
import axios from "axios";

export const userListAction = (url) => async (dispatch) => {
  dispatch(loadingUserSlice());
  try {
    const { data } = await axios.get(url, { withCredentials: true });
    if (data.statusCode === 201) {
      dispatch(userListSlice(data?.data));
    }
  } catch (error) {
    dispatch(errorUserSlice(error?.response?.data?.message));
  }
};

export const getUserProfileAction = (url) => async (dispatch) => {
  dispatch(loadingUserSlice());
  try {
    const { data } = await axios.get(url, { withCredentials: true });
    if (data.statusCode === 201) {
      dispatch(getUserProfileSlice(data?.data));
    }
  } catch (error) {
    dispatch(errorUserSlice(error?.response?.data?.message));
  }
};

export const logOutUserAction = (url) => async (dispatch) => {
  dispatch(loadingUserSlice());
  try {
    const { data } = await axios.post(url, null, { withCredentials: true });
    if (data.statusCode === 201) {
      dispatch(logOutUserSlice());
    }
  } catch (error) {
    dispatch(error?.response?.data?.message);
  }
};
