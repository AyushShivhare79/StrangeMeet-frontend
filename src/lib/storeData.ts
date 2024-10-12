interface storeType {
  message: any;
  pc: RTCPeerConnection;
  socket: WebSocket;
}

export const storeData = ({ message, pc, socket }: storeType) => {
  switch (message.type) {
    case "createAnswer":
      console.log("InsideAnswer: ", message.type);
      pc.setRemoteDescription(message.sdp);

      break;

    case "createOffer":
      console.log("InsideOffer: ", message.type);

      pc.setRemoteDescription(message.sdp).then(() => {
        pc.createAnswer().then((answer) => {
          pc.setLocalDescription(answer);
          console.log("YeahSendingAnswerNow");
          socket.send(
            JSON.stringify({
              type: "createAnswer",
              sdp: answer,
            })
          );
        });
      });

      break;

    case "iceCandidate":
      console.log("InsiderIcce: ", message.type);
      pc.addIceCandidate(message.candidate);

      break;
  }
};
