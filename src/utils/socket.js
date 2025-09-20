import { useRef } from "react";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socketConnection = () => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const user = JSON?.parse(localStorage?.getItem("user"));
  useEffect(() => {
    const socket = io("http://localhost:4002", {
      withCredentials: true,
      query: {
        userId: user?._id,
      },
    });

    socketRef.current = socket;
    socket.on("connect", () => {
      setConnected(true);
    });
    socket.on("disconnect", () => {
      console.log("user disconnected..");
      setConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return { socket: socketRef, connected };
};

export default socketConnection;
