import { useEffect, useRef, useState } from "react";
import Chat from "./Chat";
import { storeData } from "../lib/storeData";
// import { useNavigate } from "react-router-dom";

export default function MainCall() {
  const [socket, setSocket] = useState<WebSocket | null>();
  const [pc, setPc] = useState<RTCPeerConnection>();

  const [user, setUser] = useState<string>();

  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_PORT);
    setSocket(socket);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setUser(message.user);
    };
    console.log("User: ", user);
    const pc = new RTCPeerConnection();
    setPc(pc);
  }, []);

  if (!socket || !pc || !user) {
    return;
  }

  socket.onmessage = async (event) => {
    const message = JSON.parse(event.data);
    storeData({ message, pc, socket });
  };

  switch (user) {
    case "user1":
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
      break;

    case "user2":
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

      break;
  }
  //Test

  // pc.addEventListener(
  //   "connectionstatechange",
  //   (event) => {
  //     switch (pc.connectionState) {
  //       case "new":
  //       case "connecting":
  //         setOnlineStatus("Connecting…");
  //         break;
  //       case "connected":
  //         setOnlineStatus("Online");
  //         break;
  //       case "disconnected":
  //         setOnlineStatus("Disconnecting…");
  //         break;
  //       case "closed":
  //         setOnlineStatus("Offline");
  //         break;
  //       case "failed":
  //         setOnlineStatus("Error");
  //         break;
  //       default:
  //         setOnlineStatus("Unknown");
  //         break;
  //     }
  //   },
  //   false
  // );

  //Test

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
