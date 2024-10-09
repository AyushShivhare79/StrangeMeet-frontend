import { useEffect, useState } from "react";

export default function Test() {
  const [socket, setSocket] = useState<WebSocket | null>();
//   const [pc, setPc] = useState<RTCPeerConnection>();

  const [user, setUser] = useState<string>();
  const pc = new RTCPeerConnection();

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    setSocket(socket);
    // socket.onopen = (event: any) => {
    //   const message = JSON.parse(event.data);
    //   console.log("message: ", message);
    // };
  }, []);

  if (!socket) {
    return;
  }

  socket.onmessage = async (event) => {
    const message = JSON.parse(event.data);
    setUser(message.user);

    console.log("message: ", message);
    if (message.type === "createAnswer") {
      await pc.setRemoteDescription(message.sdp);
    } else if (message.type === "createOffer") {
      console.log("Inside here");
      pc.setRemoteDescription(message.sdp).then(() => {
        pc.createAnswer().then((answer) => {
          pc.setLocalDescription(answer);
          socket.send(
            JSON.stringify({
              type: "createAnswer",
              sdp: answer,
            })
          );
        });
      });
    } else if (message.type === "iceCandidate") {
      pc.addIceCandidate(message.candidate);
    }
  };

  if (user === "user2") {
    const video = document.createElement("video");
    document.body.appendChild(video);

    const pc = new RTCPeerConnection();
    pc.ontrack = (event) => {
      video.srcObject = new MediaStream([event.track]);
      video.play();
    };
  }
  if (user === "user1") {
    console.log("TEST");

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

    pc.onnegotiationneeded = async () => {
        console.log("Negotiation")
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket?.send(
        JSON.stringify({
          type: "createOffer",
          sdp: pc.localDescription,
        })
      );
      getCameraStreamAndSend(pc);
    };

    const getCameraStreamAndSend = (pc: RTCPeerConnection) => {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        const video = document.createElement("video");
        video.srcObject = stream;
        video.play();
        // this is wrong, should propogate via a component
        document.body.appendChild(video);
        stream.getTracks().forEach((track) => {
          pc?.addTrack(track);
        });
      });
    };
    console.log("user: ", user)
  }

  return (
    <>
      <div></div>
    </>
  );
}
