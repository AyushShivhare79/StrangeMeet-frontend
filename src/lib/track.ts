interface trackType {
  pc: RTCPeerConnection;
  remoteRef: React.RefObject<HTMLVideoElement>;
  localRef: React.RefObject<HTMLVideoElement>;
  //   user: string | undefined;
}

export const Track = ({ pc, remoteRef, localRef }: trackType) => {
  console.log("Camera get");


  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    if (localRef.current) {
      localRef.current.srcObject = stream;
      localRef.current.play();
    }
    stream.getTracks().forEach((track) => {
      pc?.addTrack(track);
    });
  });

  pc.ontrack = (event) => {
    if (remoteRef.current) {
      remoteRef.current.srcObject = new MediaStream([event.track]);
      remoteRef.current.play();
    }
  };

  // navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  //   if (localRef.current) {
  //     localRef.current.srcObject = stream;
  //     localRef.current.play();
  //   }
  //   stream.getTracks().forEach((track) => {
  //     pc?.addTrack(track);
  //   });
  // });
};
