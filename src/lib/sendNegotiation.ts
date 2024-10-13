interface negotiationType {
  pc: RTCPeerConnection;
  socket: WebSocket;
}

export const sendNegotiation = ({ pc, socket }: negotiationType) => {
  pc.onnegotiationneeded = async () => {
    console.log("negotiation send")

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await socket?.send(
      JSON.stringify({
        type: "createOffer",
        sdp: pc.localDescription,
      })
    );
  };
};
