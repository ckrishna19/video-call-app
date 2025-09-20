// import { lazy, Suspense, useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import PrivateRoute from "./utils/PrivateRoute";
// import PublicRoute from "./utils/PublicRoute";
// import "./App.css";
// const Home = lazy(() => import("./pages/Home"));
// const Login = lazy(() => import("./pages/Login"));
// const Register = lazy(() => import("./pages/Register"));
// const ForgetPassword = lazy(() => import("./pages/ForgetPassword"));
// function App() {
//   return (
//     <BrowserRouter>
//       <Suspense fallback={<p>Loading...</p>}>
//         <Routes>
//           <Route element={<PublicRoute />}>
//             <Route path="/register" element={<Register />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/forget-password" element={<ForgetPassword />} />
//           </Route>
//           <Route element={<PrivateRoute />}>
//             <Route path="/" element={<Home />} />
//           </Route>
//         </Routes>
//       </Suspense>
//     </BrowserRouter>
//   );
// }

// export default App;

import React from "react";

const App = () => {
  return (
    <div>
      <p>app</p>
    </div>
  );
};

export default App;
