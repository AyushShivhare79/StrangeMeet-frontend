interface negotiationType {
  pc: RTCPeerConnection;
  socket: WebSocket;
}

export const sendNegotiation = ({ pc, socket }: negotiationType) => {
  pc.onnegotiationneeded = async () => {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket?.send(
      JSON.stringify({
        type: "createOffer",
        sdp: pc.localDescription,
      })
    );
  };
};
