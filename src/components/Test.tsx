// export default function Test(pc: RTCPeerConnection) {
//   switch (pc.connectionState) {
//     case "new":
//     case "connecting":
//       setOnlineStatus("Connecting…");
//       break;
//     case "connected":
//       setOnlineStatus("Online");
//       break;
//     case "disconnected":
//       setOnlineStatus("Disconnecting…");
//       break;
//     case "closed":
//       setOnlineStatus("Offline");
//       break;
//     case "failed":
//       setOnlineStatus("Error");
//       break;
//     default:
//       setOnlineStatus("Unknown");
//       break;
//   }
//   console.log("STATE: ", listen);

//   return (
//     <>
//       <div></div>
//     </>
//   );
// }
