import React from "react";

const MyVdo = ({ localVideoRef, remoteVideoRef }) => {
  return (
    <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
      <div style={{ flex: 1 }}>
        <h3>Your Video</h3>

        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "100%", borderRadius: 8 }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <h3>Remote Video</h3>
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{ width: "100%", borderRadius: 8 }}
        />
      </div>
    </div>
  );
};

export default MyVdo;
