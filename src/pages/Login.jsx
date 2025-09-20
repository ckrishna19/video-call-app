// module import

import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  clearUserError,
  errorUserSlice,
  getMyProfile,
  loadingUserSlice,
} from "../redux/slice/userSlice";

import { MdEmail } from "react-icons/md";
import axios from "axios";
import { loginUrl } from "../redux/api";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user || {});

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    dispatch(loadingUserSlice());
    try {
      const { data } = await axios.post(
        loginUrl,
        { email, password },
        { withCredentials: true }
      );
      if (data?.statusCode === 201) {
        dispatch(getMyProfile(data.data));
        localStorage.setItem("user", JSON.stringify(data?.data));
        navigate("/");
        setEmail("");
        setPassword("");
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
    <div className="flex items-center justify-center h-screen  text-white">
      <div className=" shadow-lg rounded-lg p-8 max-w-md w-full border">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Welcome Back
        </h1>
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
        <form onSubmit={handleLoginSubmit}>
          <div className="flex items-center bg-gray-800 p-3 rounded-md">
            <MdEmail className="text-gray-400 mr-2" size={20} />
            <input
              type="email"
              required
              placeholder="Enter your email"
              autoComplete="true"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=" w-full outline-none bg-transparent text-gray-300  h-full autofill:bg-gray-800"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              className=" bg-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <Link
          to="/forget-password"
          className="text-blue-500 hover:underline mt-4"
        >
          Forget Passowrd
        </Link>
        <p className="text-sm text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
