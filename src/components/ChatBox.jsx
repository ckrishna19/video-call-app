// module import
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import socketConnection from "../utils/socket";
import {
  errorMessageSlice,
  loadingMessageSlice,
  newMessageSlice,
} from "../redux/slice/messageSlice";
import axios from "axios";
import {
  getAllMessageApi,
  getUserProfileApi,
  newMessageApi,
} from "../redux/api";
import { getAllMessageAction } from "../redux/action/messageAction";
import { createNewChatSlice, errorChatSlice } from "../redux/slice/chatSlice";
import { getAllChatAction } from "../redux/action/chatAction";
import { getUserProfileAction } from "../redux/action/userAction";
import ChatHeader from "./ChatHeader";
import VideoCall from "./VideoCall";
import IncomingCall from "./IncommingCall";
import Vdo from "./Vdo";
import IncomingVdo from "./IncommingCall";
import MyVdo from "./Myvdo";

// Component function
const ChatBox = ({ userName, closeChat }) => {
  const [text, setText] = useState("");
  const { socket, connected } = socketConnection();
  const messageRef = useRef();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage?.getItem("user"));
  const roomId = [userName, user?._id].join("").split("").sort().join("");
  const chatList = useSelector((state) => state?.chat?.chatMap[roomId] || []);
  const { userProfile } = useSelector((state) => state?.user || {});

  const sortedMessages = [...chatList].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const handleChange = (e) => {
    setText(e.target.value);
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const newMessage = { text, receivedBy: userName, sentBy: user?._id };
    const data = { roomId, newMessage };
    socket.current.emit("send-msg", data);

    dispatch(loadingMessageSlice());
    try {
      const res = await axios.post(newMessageApi, data, {
        withCredentials: true,
      });
      if (res.data.statusCode === 201) {
        dispatch(createNewChatSlice({ roomId, newMessage: res?.data?.data }));
        setText("");
      }
    } catch (error) {
      dispatch(errorChatSlice(error.response.data.message));
    }
  };

  useEffect(() => {
    dispatch(getAllChatAction(`${getAllMessageApi}/${userName}`, roomId));
  }, [userName, roomId]);

  useEffect(() => {
    dispatch(getUserProfileAction(`${getUserProfileApi}/${userName}`));
  }, [userName]);

  useEffect(() => {
    if (chatList.length > 0) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatList]);

  useEffect(() => {
    if (!socket?.current) return;
    socket.current.on("rcv-msg", (data) => {
      dispatch(createNewChatSlice(data));
    });
  }, []);

  // web rtc connections..
  const [callingTo, setCallingTo] = useState(null);
  const [inCallWith, setInCallWith] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callStatus, setCallStatus] = useState(""); // idle, calling, in-call
  //  const [email, setEmail] = useState("");
  //  const socketRef = socketConnection().socket;

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const ICE_SERVERS = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };
  //  const user = localStorage.getItem("user");

  useEffect(() => {
    socket.current.on("incoming-call", async ({ caller, offer }) => {
      console.log("Incoming call from", caller);
      setIncomingCall({ caller, offer });
    });

    socket.current.on("call-accepted", async ({ answer }) => {
      if (!pcRef.current) return;
      await pcRef.current.setRemoteDescription(answer);
      setCallStatus("in-call");
      setInCallWith(callingTo);
      setCallingTo(null);
    });

    socket.current.on("call-declined", () => {
      alert("Call declined");
      cleanupCall();
    });

    socket.current.on("ice-candidate", async ({ candidate }) => {
      console.log(candidate);
      if (pcRef.current && candidate) {
        try {
          await pcRef.current.addIceCandidate(candidate);
        } catch (err) {
          console.error("Failed to add ICE candidate", err);
        }
      }
    });

    socket.current.on("call-ended", () => {
      alert("Call ended");
      cleanupCall();
    });

    socket.current.on("disconnect", () => {
      cleanupCall();
    });

    return () => {
      socket.current.disconnect();
      cleanupCall();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startLocalStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      return stream;
    } catch (err) {
      alert("Could not access camera/microphone: " + err.message);
      throw err;
    }
  }

  function createPeerConnection(targetUsername) {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit("ice-candidate", {
          targetUser: targetUsername,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      console.log("Peer connection state:", state);
      if (["disconnected", "failed", "closed"].includes(state)) {
        cleanupCall();
      }
    };

    return pc;
  }

  async function callUser(targetUser) {
    if (callStatus !== "" && callStatus !== "idle") {
      alert("Already in call or calling");
      return;
    }
    setCallingTo(targetUser);
    setCallStatus("calling");

    try {
      const pc = createPeerConnection(targetUser);
      pcRef.current = pc;
      const stream = await startLocalStream();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.current.emit("call-user", {
        targetUser,
        caller: user?._id,
        offer,
      });
    } catch (err) {
      alert("Error initiating call: " + err.message);
      cleanupCall();
    }
  }

  async function callUserByInput(targetUser) {
    if (callStatus !== "" && callStatus !== "idle") {
      alert("Already in call or calling");
      return;
    }
    setCallingTo(targetUser);
    setCallStatus("calling");

    try {
      const pc = createPeerConnection(targetUser);
      pcRef.current = pc;
      const stream = await startLocalStream();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.current.emit("call-user", {
        targetUser,
        caller: user._id,
        offer,
      });
    } catch (err) {
      alert("Error initiating call: " + err.message);
      cleanupCall();
    }
  }

  async function acceptCall() {
    if (!incomingCall) return;

    try {
      setCallStatus("in-call");
      setInCallWith(incomingCall.caller);
      setIncomingCall(null);

      const pc = createPeerConnection(incomingCall.caller);
      pcRef.current = pc;

      const stream = await startLocalStream();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(incomingCall.offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.current.emit("accept-call", {
        caller: incomingCall.caller,
        answer,
      });
    } catch (err) {
      alert("Failed to accept call: " + err.message);
      cleanupCall();
    }
  }

  function declineCall() {
    if (incomingCall) {
      socket.current.emit("decline-call", { caller: incomingCall.caller });
      setIncomingCall(null);
    }
  }

  function endCall() {
    if (callStatus === "idle") return;
    socket.current.emit("end-call", { targetUser: inCallWith || callingTo });
    cleanupCall();
  }
  function cleanupCall() {
    try {
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    } catch (err) {
      console.warn("Cleanup error", err);
    }

    setCallStatus("");
    setCallingTo(null);
    setInCallWith(null);
    setIncomingCall(null);
  }

  return (
    <>
      <div className="flex flex-col h-[95vh] ">
        <ChatHeader
          handleCallUser={callUserByInput}
          userName={userName}
          userProfile={userProfile}
          closeChat={closeChat}
        />
        {/* Message List */}

        <h1>Video Call </h1>
        {/* <MyVdo localVideoRef={localVideoRef} remoteVideoRef={remoteVideoRef} /> */}
        <div style={{ marginBottom: 20 }}>
          {(callStatus === "calling" || callStatus === "in-call") && (
            <div style={{ marginBottom: 10 }}>
              <strong>Status:</strong>{" "}
              {callStatus === "calling"
                ? `Calling ${callingTo}...`
                : `In call with ${inCallWith}`}
            </div>
          )}
          {(callStatus === "calling" || callStatus === "in-call") && (
            <button
              onClick={endCall}
              style={{
                background: "#f44336",
                color: "white",
                padding: "10px 20px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              End Call
            </button>
          )}
        </div>
        {(incomingCall ||
          callStatus === "in-call" ||
          callStatus === "calling") && (
          <>
            <div className="flex border ">
              <div className=" w-1/4  aspect-square rounded">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  className="w-full border rounded-md"
                />
              </div>
              <div className="flex w-1/2">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full aspect-square rounded"
                />
              </div>
            </div>
            <button
              onClick={endCall}
              style={{
                background: "#f44336",
                color: "white",
                padding: "10px 20px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              End Call.....
            </button>
          </>
        )}

        <div className="flex-grow overflow-y-auto  p-4 rounded-lg space-y-2">
          {chatList?.length > 0 &&
            chatList?.map((msg, index) => (
              <div key={index} ref={messageRef} className="block">
                <p
                  className={`text-gray-300 border px-3 bg-gray-700 my-4 py-1 rounded-full w-max ${
                    msg.sentBy === user._id ? "ml-auto" : "mr-auto"
                  }`}
                >
                  {msg.text}
                </p>
              </div>
            ))}
        </div>

        {/* Input Box */}
        <div className="mt-4 flex items-end gap-x-2">
          <textarea
            type="text"
            rows={1}
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-400 text-white resize-none"
            value={text}
            onChange={handleChange}
            placeholder="Type your message..."
            style={{ overflow: "hidden" }}
          />
          <button
            onClick={handleSendMessage}
            className=" mt-2 bg-blue-600 py-2 px-6 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
      {incomingCall && (
        <IncomingVdo
          incomingCall={incomingCall}
          acceptCall={acceptCall}
          declineCall={declineCall}
        />
      )}
      {}
    </>
  );
};

export default ChatBox;
