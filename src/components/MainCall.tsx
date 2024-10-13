import { useEffect, useRef, useState } from "react";
import Chat from "./Chat";
import { storeData } from "../lib/storeData";
import { Track } from "../lib/track";
import { sendIceCandidate } from "../lib/sendIceCandidate";
import { sendNegotiation } from "../lib/sendNegotiation";

export default function MainCall() {
  const [socket, setSocket] = useState<WebSocket | null>();
  const [pc, setPc] = useState<RTCPeerConnection>();

  const [user, setUser] = useState<string>();

  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_PORT);
    setSocket(socket);

    // socket.onmessage = (event) => {
    //   const message = JSON.parse(event.data);
    //     setUser(message.user);
    // };
    // console.log("User: ", user);

    const pc = new RTCPeerConnection();
    setPc(pc);
  }, []);

  console.log(`Socket: ${socket}, Pc: ${pc}, User: ${user}`);
  if (!socket || !pc) {
    return;
  }

  //states

  // pc.addEventListener(
  //   "connectionstatechange",
  //   (event) => {
  //     switch (pc.connectionState) {
  //       case "new":
  //       case "connecting":
  //         setOnlineStatus("Connecting");
  //         break;
  //       case "connected":
  //         setOnlineStatus("connected");
  //         break;
  //       case "disconnected":
  //         setOnlineStatus("disconnected");
  //         break;
  //       case "closed":
  //         setOnlineStatus("closed");
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

  socket.onmessage = async (event) => {
    const message = JSON.parse(event.data);
    if (!user) {
      setUser(message.user);
    }
    console.log("User: ", user);

    storeData({ message, pc, socket });
  };

  switch (user) {
    case "user1":
      sendIceCandidate({ pc, socket });

      sendNegotiation({ pc, socket });
      // Use forward ref concept
      Track({ pc, remoteRef, localRef });

      break;

    case "user2":
      sendIceCandidate({ pc, socket });

      Track({ pc, remoteRef, localRef });

      break;
  }
  // Track({ pc, remoteRef, localRef, user });

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
