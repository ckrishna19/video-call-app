import React, { useMemo, useState, useEffect, useRef } from "react";
import ChatBox from "../components/ChatBox";
import ChatList from "../components/ChatList";
import UserList from "../components/UserList";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import socketConnection from "../utils/socket";
import { logOutUserAction } from "../redux/action/userAction";
import { logOutUserApi } from "../redux/api";
import { persistor } from "../redux/store";
import IncomingCall from "../components/IncommingCall";
import VideoCall from "../components/VideoCall";
import Feed from "../components/Feed";
const Home = () => {
  const socketRef = socketConnection().socket;

  // Redux and state management
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [chatUser, setChatUser] = useState(null);
  const user = JSON.parse(localStorage?.getItem("user"));
  const { socket } = socketConnection();
  // UI state
  const [open, setOpen] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const [userName, setUserName] = useState(null);
  const [text, setText] = useState("");
  const [onlineUser, setOnlineUser] = useState([]);
  const [msg, setMsg] = useState();
  // WebRTC state and refs

  // UI handlers

  const openChat = (id) => {
    if (id) {
      setUserName(id);
      setOpen(true);
    }
  };

  const closeChat = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    dispatch(logOutUserAction(logOutUserApi));
    localStorage.removeItem("user");
    navigate("/login");
    await persistor.purge();
  };

  useEffect(() => {
    socket.current.on("online-user", (data) => {
      setOnlineUser(Object.keys(data));
    });
  }, []);

  return (
    <>
      <div className="flex overflow-hidden h-screen text-primary-softBlue">
        {/* User list section */}
        <div className="w-1/4 p-4 border-r border-primary-goldenYellow">
          <h2 className="text-xl font-bold mb-4">All Users</h2>
          <UserList openChat={openChat} onlineUser={onlineUser} />
        </div>

        {/* Main content section */}
        <div className="w-full flex flex-col h-full">
          <div className="flex-grow p-4 overflow-scroll">
            {!open ? (
              <>
                <Feed handleLogout={handleLogout} />
              </>
            ) : (
              <ChatBox
                chatUser={chatUser}
                userName={userName}
                closeChat={closeChat}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
