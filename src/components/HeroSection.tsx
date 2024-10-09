import { useEffect, useRef, useState } from "react";

const HeroSection = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [pc, setPC] = useState<RTCPeerConnection | null>(null);

  const [userType, setUserType] = useState<string>();

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.138.114:8080");
    setSocket(socket);
    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      console.log("message: ", message);
      setUserType(message.type);
    };
  }, []);

  // const getCameraStreamAndSend = (pc: RTCPeerConnection) => {
  //   navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  //     stream.getTracks().forEach((track) => {
  //       pc?.addTrack(track);
  //     });
  //   });
  //   pc.ontrack = (event) => {
  //     if (videoRef.current) {
  //       videoRef.current.srcObject = new MediaStream([event.track]);
  //       videoRef.current.play();
  //     }
  //   };
  // };

  if (userType === "sender") {
    if (!socket) {
      return alert("Socket not found");
    }

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "sender",
        })
      );
    };
    const pc = new RTCPeerConnection();

    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      console.log("message: ", message);
      if (message.type === "createAnswer") {
        await pc.setRemoteDescription(message.sdp);
      } else if (message.type === "iceCandidate") {
        pc.addIceCandidate(message.candidate);
      }
    };

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
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket?.send(
        JSON.stringify({
          type: "createOffer",
          sdp: pc.localDescription,
        })
      );
    };

    //

    pc.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = new MediaStream([event.track]);
        videoRef.current.play();
      }
    };

    // getCameraStreamAndSend(pc);
  } else if (userType === "receiver") {
    if (!socket) {
      return alert("Socket not found");
    }

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "receiver",
        })
      );
    };

    const pc = new RTCPeerConnection();
    // setPC(pc);
    // @ts-ignore
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "createOffer") {
        pc.setRemoteDescription(message.sdp).then(() => {
          pc.createAnswer().then((answer) => {
            pc.setLocalDescription(answer);
            // @ts-ignore
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

    //
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      stream.getTracks().forEach((track) => {
        pc?.addTrack(track);
      });
    });
    // getCameraStreamAndSend(pc);
  }

  return (
    <div>
      <div>
        <h1>Remote</h1>
        <video autoPlay ref={videoRef}></video>
      </div>
    </div>
  );
};

export default HeroSection;
