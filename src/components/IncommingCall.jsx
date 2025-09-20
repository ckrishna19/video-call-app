import React from "react";

const IncomingVdo = ({ incomingCall, acceptCall, declineCall }) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.75)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "white",
          padding: 30,
          borderRadius: 10,
          textAlign: "center",
          width: 320,
        }}
      >
        <h2>Incoming Call</h2>
        <p>{incomingCall.caller} is calling you</p>
        <button
          onClick={acceptCall}
          style={{
            marginRight: 10,
            padding: "10px 20px",
            borderRadius: 6,
            cursor: "pointer",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
          }}
        >
          Accept
        </button>
        <button
          onClick={declineCall}
          style={{
            padding: "10px 20px",
            borderRadius: 6,
            cursor: "pointer",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
          }}
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default IncomingVdo;
