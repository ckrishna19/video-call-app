import React, { useState } from "react";
import { MdLockOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserError,
  errorUserSlice,
  getMyProfile,
  loadingUserSlice,
} from "../redux/slice/userSlice";
import axios from "axios";
import { resetPasswordApi } from "../redux/api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({ password: "", confirm: "" });
  const { loading, error, otp } = useSelector((s) => s.user || {});
  console.log(otp);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirm) {
      alert("Passwords do not match!");
      return;
    }

    alert("Password changed successfully!");
    dispatch(loadingUserSlice());
    try {
      const { data } = await axios.post(
        resetPasswordApi,
        { password: passwords.password },
        {
          withCredentials: true,
          headers: {
            email: otp?.email,
          },
        }
      );
      if (data.statusCode === 201) {
        dispatch(getMyProfile(data?.data));
        navigate("/");
        setPasswords({ password: "", confirm: "" });
        localStorage.setItem("user", JSON.stringify(data?.data));
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
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center bg-gray-800 p-3 rounded-md">
            <MdLockOutline className="text-gray-400 mr-2" size={20} />
            <input
              type="password"
              name="password"
              required
              placeholder="New Password"
              value={passwords.password}
              onChange={handleChange}
              className="bg-transparent w-full outline-none text-gray-300 placeholder-gray-500"
            />
          </div>
          <div className="flex items-center bg-gray-800 p-3 rounded-md">
            <MdLockOutline className="text-gray-400 mr-2" size={20} />
            <input
              type="password"
              name="confirm"
              required
              placeholder="Confirm Password"
              value={passwords.confirm}
              onChange={handleChange}
              className="bg-transparent w-full outline-none text-gray-300 placeholder-gray-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition rounded-md py-2 text-white font-medium"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
