import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import Reactions from "./Reactions";

const Message = ({ message, chatId }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();
  const [messageText, setMessageText] = useState(message.text);
  const [time, setTime] = useState("");
  const [showReactions, setShowReactions] = useState(false);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setMessageText(message.text);

    if (!time) {
      const messageTime = new Date(message.date?.toDate?.());
      setTime(messageTime.toLocaleTimeString());
    }
  }, [message]);

  if (!message || !currentUser || !data.user) {
    return null;
  }

  const toggleReactions = () => {
    setShowReactions((prevShowReactions) => !prevShowReactions);
  };

  const senderDisplayName =
    message.senderId === currentUser.uid ? currentUser.displayName : data.user.displayName;

  return (
    <>
      <div
        className={`Message ${message.senderId === currentUser.uid ? 'own' : 'other'}`}
        ref={ref}
      >
        <div className="Message-normal">
          <span
            className={`Message-span ${message.senderId === currentUser.uid ? 'own' : 'other'}`}
          >
            <p className="Message-Username">{senderDisplayName} </p>
            {messageText}
          </span>
          <div className="Message-user">
            <img
              className="Message-user-img"
              src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL}
              alt="User Avatar"
            />
            <p className="Message-p">{time}</p>
          </div>
        </div>
        {message.img && <img className="Message-image" src={message.img} alt="sent" />}
        <div className="Reactions-i">
          <i
            className="fa-solid fa-face-smile-wink fa-xl"
            style={{ color: "#8587c7", cursor: "pointer" }}
            onClick={toggleReactions}
          ></i>
        </div>
        {showReactions && (
          <Reactions
            chatId={chatId}
            messageId={message.id}
            currentReactions={message.reactions}
            currentUser={currentUser}
          />
        )}
      </div>
    </>
  );
};

export default Message;
