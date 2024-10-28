import { useEffect, useState } from "react";

const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>();
  const [pc, setPc] = useState<RTCPeerConnection>();

  useEffect(() => {
    const socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_PORT);
    setSocket(socket);
    const pc = new RTCPeerConnection();
    setPc(pc);
  }, []);

  return { socket, pc };
};

export default useSocket;
