// RealWorldWebRTC.jsx
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import socketConnection from "../utils/socket";

const SERVER_URL = "http://localhost:5000";

export default function Vdo() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [socketId, setSocketId] = useState("");
  const [callingTo, setCallingTo] = useState(null);
  const [inCallWith, setInCallWith] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callStatus, setCallStatus] = useState(""); // idle, calling, in-call

  const socketRef = socketConnection().socket;
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const ICE_SERVERS = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    socketRef.current.on("incoming-call", async ({ caller, offer }) => {
      console.log("Incoming call from", caller);
      setIncomingCall({ caller, offer });
    });

    socketRef.current.on("rcv-call", async ({ answer }) => {
      console.log("Call accepted");
      if (!pcRef.current) return;
      await pcRef.current.setRemoteDescription(answer);
      setCallStatus("in-call");
      setInCallWith(callingTo);
      setCallingTo(null);
    });

    socketRef.current.on("call-declined", () => {
      alert("Call declined");
      cleanupCall();
    });

    socketRef.current.on("ice-candidate", async ({ candidate }) => {
      //   await pcRef.current.addIceCandidate(candidate);
      if (pcRef.current && candidate) {
        try {
          await pcRef.current.addIceCandidate(candidate);
        } catch (err) {
          console.error("Failed to add ICE candidate", err);
        }
      }
    });

    socketRef.current.on("call-ended", () => {
      alert("Call ended");
      cleanupCall();
    });

    socketRef.current.on("disconnect", () => {
      cleanupCall();
      setUsers([]);
      setJoined(false);
      setUsername("");
      setSocketId("");
    });

    return () => {
      socketRef.current.disconnect();
      cleanupCall();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joined]);

  // async function startLocalStream() {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //       audio: true,
  //     });
  //     localStreamRef.current = stream;
  //     if (localVideoRef.current) localVideoRef.current.srcObject = stream;
  //     return stream;
  //   } catch (err) {
  //     alert("Could not access camera/microphone: " + err.message);
  //     throw err;
  //   }
  // }

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      localStreamRef.current = stream;
      return stream;
    } catch (error) {
      console.log(error);
    }
  };

  // function createPeerConnection(targetUsername) {
  //   const pc = new RTCPeerConnection(ICE_SERVERS);

  //   pc.onicecandidate = (event) => {
  //     if (event.candidate) {
  //       socketRef.current.emit("ice-candidate", {
  //         targetUser: targetUsername,
  //         candidate: event.candidate,
  //       });
  //     }
  //   };

  //   pc.ontrack = (event) => {
  //     const remoteStream = event.streams[0];
  //     if (remoteVideoRef.current) {
  //       remoteVideoRef.current.srcObject = remoteStream;
  //     }
  //   };

  //   pc.onconnectionstatechange = () => {
  //     const state = pc.connectionState;
  //     console.log("Peer connection state:", state);
  //     if (["disconnected", "failed", "closed"].includes(state)) {
  //       cleanupCall();
  //     }
  //   };

  //   return pc;
  // }

  const createPeerConnection = (targetUser) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current.emit("ice-candidate", {
          targetUser,
          candidate: e.candidate,
        });
      }
    };

    pc.ontrack = (e) => {
      if (remoteVideoRef.current)
        remoteVideoRef.current.srcObject = e.streams[0];
    };
    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      if (["disconnected", "failed", "closed"].includes(state)) {
        cleanupCall();
      }
    };
    return pc;
  };

  // async function callUser(targetUser) {
  //   if (callStatus !== "" && callStatus !== "idle") {
  //     alert("Already in call or calling");
  //     return;
  //   }
  //   setCallingTo(targetUser);
  //   setCallStatus("calling");

  //   try {
  //     const pc = createPeerConnection(targetUser);
  //     pcRef.current = pc;
  //     const stream = await startLocalStream();
  //     stream.getTracks().forEach((track) => pc.addTrack(track, stream));

  //     const offer = await pc.createOffer();
  //     await pc.setLocalDescription(offer);

  //     socketRef.current.emit("call-user", {
  //       targetUser,
  //       caller: username,
  //       offer,
  //     });
  //   } catch (err) {
  //     alert("Error initiating call: " + err.message);
  //     cleanupCall();
  //   }
  // }
  const callUser = async (targetUser) => {
    if (callStatus !== "" && callStatus !== "idle") {
      alert("already in call");
      return;
    }

    setCallStatus("calling");
    setCallingTo(targetUser);
    try {
      const pc = createPeerConnection(targetUser);
      pcRef.current = pc;
      const stream = await startLocalStream();
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketRef.current.emit("call-user", {
        targetUser,
        offer,
        caller: username,
      });
    } catch (error) {
      console.log(error);
      cleanupCall();
    }
  };

  // async function acceptCall() {
  //   if (!incomingCall) return;

  //   try {
  //     setCallStatus("in-call");
  //     setInCallWith(incomingCall.caller);
  //     setIncomingCall(null);

  //     const pc = createPeerConnection(incomingCall.caller);
  //     pcRef.current = pc;

  //     const stream = await startLocalStream();
  //     stream.getTracks().forEach((track) => pc.addTrack(track, stream));

  //     await pc.setRemoteDescription(incomingCall.offer);
  //     const answer = await pc.createAnswer();
  //     await pc.setLocalDescription(answer);

  //     socketRef.current.emit("accept-call", {
  //       caller: incomingCall.caller,
  //       answer,
  //     });
  //   } catch (err) {
  //     alert("Failed to accept call: " + err.message);
  //     cleanupCall();
  //   }
  // }

  const acceptCall = async () => {
    if (!incomingCall) return;
    try {
      setCallStatus("in-call");
      setInCallWith(incomingCall.caller);
      setIncomingCall(null);
      const pc = createPeerConnection(incomingCall.caller);
      pcRef.current = pc;
      const stream = await startLocalStream();
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));
      await pc.setRemoteDescription(incomingCall.offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socketRef.current.emit("accept-call", {
        caller: incomingCall.caller,
        answer,
      });
    } catch (error) {
      console.log(error);
      cleanupCall();
    }
  };

  function declineCall() {
    if (incomingCall) {
      socketRef.current.emit("decline-call", { caller: incomingCall.caller });
      setIncomingCall(null);
      //  cleanupCall();
    }
  }

  function endCall() {
    if (callStatus === "idle") return;
    socketRef.current.emit("end-call", { targetUser: inCallWith || callingTo });
    pcRef.current.close();
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

  // const cleanupCall = () => {
  //   if (pcRef.current) {
  //     pcRef.current.close();
  //     pcRef.current = null
  //   }
  //   if (localStreamRef.current) {

  //   }
  // }

  function leaveRoom() {
    if (!socketRef.current) return;
    socketRef.current.emit("leave");
    socketRef.current.disconnect();
    setJoined(false);
    setUsername("");
    setUsers([]);
    cleanupCall();
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center" }}>📞 Real World WebRTC</h1>

      {/* Incoming call modal */}
    </div>
  );
}
