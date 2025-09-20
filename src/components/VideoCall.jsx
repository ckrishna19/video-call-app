// Updated VideoCall component
const VideoCall = ({
  localVideoRef,
  remoteVideoRef,
  callStatus,
  endCall,
  remoteStream,
}) => {
  return (
    <div className="video-call-container">
      <div className="video-container">
        <video ref={localVideoRef} autoPlay muted playsInline />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{ display: remoteStream ? "block" : "none" }}
        />
      </div>
      <div className="call-controls">
        <p>Call status: {callStatus}</p>
        <button onClick={endCall}>End Call</button>
      </div>
    </div>
  );
};

export default VideoCall;
