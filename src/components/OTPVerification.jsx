import React, { useEffect, useState } from "react";
import { MdVerified } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserError,
  errorUserSlice,
  loadingUserSlice,
  verifyOTPSlice,
} from "../redux/slice/userSlice";
import { sendOtpApi, verifyOtpApi } from "../redux/api";
import axios from "axios";

const OtpVerification = ({ email, onVerify, setStep }) => {
  const dispatch = useDispatch();
  const { otp, loading, error } = useSelector((state) => state?.user || {});
  const [inputOTP, setInputOTP] = useState("");
  useEffect(() => {
    let timeOut;
    if (error) {
      timeOut = setTimeout(() => {
        dispatch(clearUserError());
      }, 3000);
    }
    return () => clearTimeout(timeOut);
  }, [dispatch, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        verifyOtpApi,
        { otp: inputOTP },
        {
          withCredentials: true,
          headers: {
            otp: otp?.otp,
            time: otp?.time,
          },
        }
      );
      if (data.statusCode === 201) {
        setStep(3);
        dispatch(verifyOTPSlice({ email: otp?.email }));
      }
    } catch (error) {
      dispatch(errorUserSlice(error?.response?.data?.message));
    }
  };
  const emails = JSON.parse(JSON.stringify(otp?.email));
  const handleResendOTP = async (e) => {
    e.preventDefault();
    dispatch(loadingUserSlice());
    try {
      const { data } = await axios.post(
        sendOtpApi,
        { email: emails },
        { withCredentials: true }
      );
      if (data.statusCode === 201) {
        dispatch(
          verifyOTPSlice({
            otp: data?.data?.otp,
            time: data?.data?.time,
            email: emails,
          })
        );
      }
    } catch (error) {
      dispatch(errorUserSlice(error?.response?.data?.message));
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md">
        {error && (
          <div className="flex justify-between items-center">
            <p className="text-red-500 text-xs">{error} </p>
            <button
              className="text-red-500 text-lg"
              onClick={() => dispatch(clearUserError())}
            >
              X
            </button>
          </div>
        )}
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Verify OTP
        </h2>
        <p className="text-sm text-gray-400 text-center mb-4">
          Enter the OTP sent to <span className="text-blue-400">{email}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center bg-gray-800 p-3 rounded-md">
            <MdVerified className="text-gray-400 mr-2" size={20} />
            <input
              type="text"
              maxLength="6"
              placeholder="Enter OTP"
              value={inputOTP}
              onChange={(e) => setInputOTP(e.target.value)}
              className="bg-transparent w-full outline-none text-gray-300 placeholder-gray-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition rounded-md py-2 text-white font-medium"
          >
            Verify OTP
          </button>
        </form>
        <p className="mt-4">
          Expire OTP?
          <button
            onClick={handleResendOTP}
            className="text-green-500 cursor-pointer"
          >
            Click here to resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;
