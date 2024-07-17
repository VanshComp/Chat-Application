import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import { db } from "../firebase/firebase";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [hiddenChats, setHiddenChats] = useState({});
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    if (!currentUser?.uid) {
      return;
    }

    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data() || {});
        setHiddenChats({}); // Reset hidden chats whenever the chat list is updated
      });

      return () => {
        unsub();
      };
    };

    getChats();
  }, [currentUser?.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  const handleHide = (chatId) => {
    setHiddenChats((prevHiddenChats) => ({
      ...prevHiddenChats,
      [chatId]: !prevHiddenChats[chatId],
    }));
  };

  return (
    <>
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div
            className="Chats-found"
            key={chat[0]}
            style={{ display: hiddenChats[chat[0]] ? "none" : "flex" }}
            onClick={() => handleSelect(chat[1].userInfo)}
          >
            <img className="Search-image" src={chat[1].userInfo.photoURL}  />
            <div className="Chats-info">
              <span className="Chats-span">{chat[1].userInfo.displayName}</span>
              {chat[1].lastMessage?.text.length < 15 ? (
                <p className="Chats-p">[ {chat[1].lastMessage?.text} ]</p>
              ) : (
                <p className="Chats-p">[ .......... ]</p>
              )}
            </div>
            <div className="Chats-i">
              <i 
                className="fa-solid fa-eye-slash" 
                style={{ color: "#ffffff" }} 
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleHide(chat[0]);
                }}
              ></i>
            </div>
          </div>
        ))}
    </>
  );
};

export default Chats;
