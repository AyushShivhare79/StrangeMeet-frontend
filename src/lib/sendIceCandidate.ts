export const sendIceCandidate = ({
  pc,
  socket,
}: {
  pc: RTCPeerConnection;
  socket: WebSocket;
}) => {
  pc.onicecandidate = (event) => {
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
