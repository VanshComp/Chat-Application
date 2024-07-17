import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const Reactions = ({ chatId, messageId, currentReactions, currentUser }) => {
  const [reactions, setReactions] = useState(currentReactions || {});

  const handleReaction = async (emoji) => {
    try {
      if (!currentUser || !currentUser.uid) {
        console.error("Current user is not defined or missing UID.");
        return;
      }

      if (!chatId || !messageId) {
        console.error("Chat ID or Message ID is undefined.");
        return;
      }

      const messageRef = doc(db, `chats/${chatId}/messages/${messageId}`);
      await updateDoc(messageRef, {
        [`reactions.${currentUser.uid}`]: emoji,
      });

      setReactions((prev) => ({
        ...prev,
        [currentUser.uid]: emoji,
      }));
    } catch (error) {
      console.error("Error updating reactions:", error);
    }
  };

  return (
    <div className="Reactions">
      {["👍", "❤️", "😂", "😮", "😢", "😡"].map((emoji) => (
        <button key={emoji} className="ReactionButton" onClick={() => handleReaction(emoji)}>
          {emoji}
        </button>
      ))}
      <div className="CurrentReactions">
        {Object.values(reactions).map((reaction, index) => (
          <span key={index} className="Reaction">{reaction}</span>
        ))}
      </div>
    </div>
  );
};

export default Reactions;

