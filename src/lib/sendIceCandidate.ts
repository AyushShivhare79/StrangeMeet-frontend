export const sendIceCandidate = ({
  pc,
  socket,
}: {
  pc: RTCPeerConnection;
  socket: WebSocket;
}) => {
  pc.onicecandidate = (event) => {
    console.log("iceCandidates Send")
    if (event.candidate) {
      socket?.send(
        JSON.stringify({
          type: "iceCandidate",
          candidate: event.candidate,
        })
      );
    }
  };
};
