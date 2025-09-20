import React, { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import {
  loadingUserSlice,
  errorUserSlice,
  verifyOTPSlice,
  clearUserError,
} from "../redux/slice/userSlice";
import { sendOtpApi } from "../redux/api";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
const ForgotPassword = ({ onNext, setStep }) => {
  const dispatch = useDispatch();
  const { error, loading, otp } = useSelector((state) => state.user);
  console.log(error, otp);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loadingUserSlice());
    try {
      const { data } = await axios.post(
        sendOtpApi,
        { email },
        { withCredentials: true }
      );
      if (data.statusCode === 201) {
        dispatch(
          verifyOTPSlice({
            otp: data?.data?.otp,
            time: data?.data?.time,
            email,
          })
        );
        setStep(2);
      }
    } catch (error) {
      dispatch(errorUserSlice(error?.response?.data?.message));
    }
  };

  useEffect(() => {
    let timeOut;
    if (error) {
      timeOut = setTimeout(() => {
        dispatch(clearUserError());
      }, 3000);
    }
    return () => clearTimeout(timeOut);
  }, [dispatch, error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Forgot Password
        </h2>
        {error && (
          <div className="flex justify-between items-center my-2">
            <p className="text-red-500 text-xs">{error} </p>
            <button
              className="text-red-500 text-lg"
              onClick={() => dispatch(clearUserError())}
            >
              X
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center bg-gray-800 p-3 rounded-md">
            <MdEmail className="text-gray-400 mr-2" size={20} />
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent w-full outline-none text-gray-300 placeholder-gray-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-md py-2 text-white font-medium"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
