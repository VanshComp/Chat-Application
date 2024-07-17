import React, { useContext, useState } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../Context/ChatContext";
import { VideoCall } from "./VideoCall";

const Chat = () => {
  const { data } = useContext(ChatContext);
  const [isVideoCall, setIsVideoCall] = useState(false);

  const getDate = () => {
    const currentDate = new Date();
    return currentDate.toLocaleDateString();
  };

  const handleAddMore = () => {
    alert("Sorry Not Available!!");
  };

  const handleVideoCall = () => {
    setIsVideoCall(true);
  };

  const handleCloseVideoCall = () => {
    setIsVideoCall(false);
  };

  return (
    <div className="Chat">
      <div className="Chat-info">
        <img className="Chat-image" src={data.user?.photoURL} />
        <span className="Chat-span">{data.user?.displayName}</span>
        <div className="Chat-p" >
        <i class="fa-solid fa-check-to-slot fa-xl" style={{color: "#005eff"}}></i>  
        </div>
        <div className="Chat-i">
          <i
            className="fa-solid fa-video fa-xl"
            style={{ color: "#005eff" }}
            onClick={handleVideoCall}
          ></i>
          <i
            className="fa-solid fa-user-plus fa-xl"
            style={{ color: "#005eff" }}
            onClick={handleAddMore}
          ></i>
          <i className="fa-solid fa-ellipsis fa-xl" style={{ color: "#005eff" }} onClick={handleAddMore}></i>
        </div>
      </div>
      {isVideoCall ? (
        <VideoCall onClose={handleCloseVideoCall} />
      ) : (
        <>
          <Messages />
          <Input />
        </>
      )}
    </div>
  );
};

export default Chat;
