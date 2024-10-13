import { useEffect, useRef, useState } from "react";
import Chat from "./Chat";
import { storeData } from "../lib/storeData";
import { Track } from "../lib/track";
import { sendIceCandidate } from "../lib/sendIceCandidate";
import { sendNegotiation } from "../lib/sendNegotiation";
import { useNavigate } from "react-router-dom";

export default function MainCall() {
  const [socket, setSocket] = useState<WebSocket | null>();
  const [pc, setPc] = useState<RTCPeerConnection>();

  const [user, setUser] = useState<string>();

  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  const navigate = useNavigate();
  useEffect(() => {
    const socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_PORT);
    setSocket(socket);
    const pc = new RTCPeerConnection();
    setPc(pc);
  }, []);

  console.log("SOCKET: ", socket, "PC: ", pc);

  if (!socket || !pc) {
    return;
  }

  socket.onmessage = async (event) => {
    const message = JSON.parse(event.data);
    console.log("HERE", message);

    if (message.message === "Other user disconnect") {
      navigate(0);

      return pc.close();
    }
    if (!user) {
      setUser(message.user);
    }
    console.log("User: ", user);

    storeData({ message, pc, socket });
  };

  socket.onclose;

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
