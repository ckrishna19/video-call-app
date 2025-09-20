import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
const PrivateRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  //  const user = null;
  return user !== null ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
