import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserError,
  errorUserSlice,
  getMyProfile,
  loadingUserSlice,
} from "../redux/slice/userSlice";
import axios from "axios";
import { registerApi } from "../redux/api";

const RegisterPage = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state?.user || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((pre) => ({ ...pre, [name]: value }));
  };

  const registerNewUser = async (e) => {
    e.preventDefault();
    dispatch(loadingUserSlice());
    try {
      const { data } = await axios.post(registerApi, userInfo, {
        withCredentials: true,
      });
      if (data.statusCode === 201) {
        dispatch(getMyProfile(data.data));

        localStorage.setItem("user", JSON.stringify(data.data));
        navigate("/");
        setUserInfo({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          confirmPassword: "",
        });
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
    <div className="flex items-center justify-center h-screen ">
      <div className="border shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Create an Account
        </h1>
        {error && (
          <div className="flex justify-between items-center text-red-500">
            <p className="text-red-500 text-xs">{error} </p>
            <button onClick={() => dispatch(clearUserError())}>X</button>
          </div>
        )}
        <form onSubmit={registerNewUser}>
          <div className="mb-4 flex gap-x-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                onChange={handleChange}
                name="firstName"
                value={userInfo.firstName}
                className=" bg-transparent text-gray-300 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="First Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                onChange={handleChange}
                name="lastName"
                value={userInfo.lastName}
                className=" bg-transparent text-gray-300 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Last Name"
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={userInfo.email}
              name="email"
              onChange={handleChange}
              className="bg-transparent text-gray-300 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
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
              type="password"
              id="password"
              value={userInfo.password}
              onChange={handleChange}
              name="password"
              className="bg-transparent text-gray-300 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={userInfo.confirmPassword}
              onChange={handleChange}
              className="bg-transparent text-gray-300 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirm your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
