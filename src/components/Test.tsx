import { useEffect, useRef, useState } from "react";
import Chat from "./Chat";

export default function Test() {
  const [socket, setSocket] = useState<WebSocket | null>();
  const [pc, setPc] = useState<RTCPeerConnection>();

  const [user, setUser] = useState<string>();

  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    setSocket(socket);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Test: ", message);
      setUser(message.user);
    };
    const pc = new RTCPeerConnection();
    setPc(pc);
  }, []);

  if (!socket || !pc || !user) {
    return;
  }

  socket.onmessage = async (event) => {
    const message = JSON.parse(event.data);
    // setUser(message.user);

    //This is for setting the peer connection

    console.log("message: ", message);
    if (message.type === "createAnswer") {
      pc.setRemoteDescription(message.sdp);
    } else if (message.type === "createOffer") {
      console.log("Accept offer!");
      pc.setRemoteDescription(message.sdp).then(() => {
        console.log("Create Answer!");
        pc.createAnswer().then((answer) => {
          pc.setLocalDescription(answer);
          console.log("Finally send");
          socket.send(
            JSON.stringify({
              type: "createAnswer",
              sdp: answer,
            })
          );
          console.log("PC: ", pc);
        });
      });
    } else if (message.type === "iceCandidate") {
      pc.addIceCandidate(message.candidate);
      console.log("Added: ", pc);
    }
  };

  if (user === "user1") {
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
      console.log("NegotiationSend");
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket?.send(
        JSON.stringify({
          type: "createOffer",
          sdp: pc.localDescription,
        })
      );
    };

    const getCameraStreamAndSend = (pc: RTCPeerConnection) => {
      pc.ontrack = (event) => {
        if (remoteRef.current) {
          remoteRef.current.srcObject = new MediaStream([event.track]);
          remoteRef.current.play();
        }
      };

      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        // const video = document.createElement("video");
        //
        if (localRef.current) {
          localRef.current.srcObject = stream;
          localRef.current.play();
        }
        //

        // video.play();

        // this is wrong, should propogate via a component

        // document.body.appendChild(video);
        stream.getTracks().forEach((track) => {
          pc?.addTrack(track);
        });
      });
    };
    getCameraStreamAndSend(pc);
  } else if (user === "user2") {
    pc.ontrack = (event) => {
      if (remoteRef.current) {
        remoteRef.current.srcObject = new MediaStream([event.track]);
        remoteRef.current.play();
      }
    };
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (localRef.current) {
        localRef.current.srcObject = stream;
        localRef.current.play();
      }
      stream.getTracks().forEach((track) => {
        pc?.addTrack(track);
      });
    });

    // const video = document.createElement("video");
    // document.body.appendChild(video);
    // pc.ontrack = (event) => {
    //   video.srcObject = new MediaStream([event.track]);
    //   video.play();
    // };
  }

  return (
    <>
      <div className="p-5 grid grid-cols-3 h-screen">
        <div className="rounded-xl h-full w-full flex flex-col items-center gap-5 ">
          {/* Container */}
          <div className="flex justify-center items-center min-h-[40%]  min-w-[95%] max-w-[30%]">
            <video
              className="rounded-xl object-cover min-h-[40%] min-w-[95%] max-w-[30%]"
              autoPlay
              ref={remoteRef}
            ></video>
          </div>
          <div className="flex justify-center items-center min-h-[40%]  min-w-[95%] max-w-[30%]">
            <video
              className="rounded-xl object-cover min-h-[40%] min-w-[95%] max-w-[30%]"
              autoPlay
              ref={localRef}
            ></video>
          </div>
        </div>
        <div className="col-span-2 ">
          <Chat />
        </div>
      </div>
    </>
  );
}
