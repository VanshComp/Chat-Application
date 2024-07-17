import * as React from 'react';
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const randomID = (len = 5) => {
  const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const getUrlParams = (url = window.location.href) => {
  const urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
};

const myMeeting = async (element) => {
  const roomID = getUrlParams().get('roomID') || randomID(5);
  const appID = 1892837988;
  const serverSecret = "9b8aac48d67906d6fd5278326167bf45";
  const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, Date.now().toString(), "Vansh Gautam");

  const zp = ZegoUIKitPrebuilt.create(kitToken);

  zp.joinRoom({
    container: element,
    sharedLinks: [
      {
        name: 'Personal link',
        url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`,
      },
    ],
    scenario: {
      mode: ZegoUIKitPrebuilt.OneONoneCall,
    },
    showScreenSharingButton: false,
  });

  return zp;
};

export const VideoCall = ({ onClose }) => {
  const videoCallRef = React.useRef(null);

  React.useEffect(() => {
    let zp;
    const initializeMeeting = async () => {
      zp = await myMeeting(videoCallRef.current);
    };
    initializeMeeting();

    return () => {
      if (zp) zp.destroy();
    };
  }, []);

  return (
    <div
      className="myCallContainer"
      ref={videoCallRef}
      style={{ width: '100vw', height: '100vh' }}
    >
      <button onClick={onClose} className='VideoCall-Close-btn'>Close!!</button>
    </div>
  );
};
