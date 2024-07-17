import React, { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import EmojiPicker from "emoji-picker-react";
import swal from "sweetalert";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [recording, setRecording] = useState(null); // State for recording
  const [recordingInProgress, setRecordingInProgress] = useState(false); // Animation state
  const [reactions, setReactions] = useState({});

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        setRecording(blob);
        setRecordingInProgress(false); // Stop animation
      };

      mediaRecorder.start();
      setRecordingInProgress(true); // Start animation
      setTimeout(() => {
        mediaRecorder.stop();
      }, 100000); 
    } catch (error) {
      console.error("Error starting recording:", error);
      setRecordingInProgress(false); // Stop animation in case of error
    }
  };

  const handleSend = async () => {
    if (!data.chatId) {
      swal({
        title: "Oops!",
        text: "Something Went Wrong!!",
        icon: "error",
        button: "Try Again",
      });
      return;
    }
    if (text === "") {
      swal({
        title: "Oops!",
        text: "No message!!",
        icon: "error",
        button: "Try Again",
      });
      return;
    }
    if (img) {
      const storageRef = ref(storage, uuid());
  
      const uploadTask = uploadBytesResumable(storageRef, img);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.error("Upload failed", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: downloadURL,
              reactions: reactions,
            }),
          });
        }
      );
    } else if (recording) {
      const storageRef = ref(storage, uuid());
  
      const uploadTask = uploadBytesResumable(storageRef, recording);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.error("Upload failed", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              senderId: currentUser.uid,
              date: Timestamp.now(),
              voice: downloadURL,
              reactions: reactions,
            }),
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          reactions: reactions,
        }),
      });
    }
  
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [`${data.chatId}.lastMessage`]: {
        text,
        reactions: reactions,
      },
      [`${data.chatId}.date`]: serverTimestamp(),
    });
  
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [`${data.chatId}.lastMessage`]: {
        text,
        reactions: reactions,
      },
      [`${data.chatId}.date`]: serverTimestamp(),
    });
  
    setText("");
    setImg(null);
    setRecording(null);
    setReactions({});
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleEmojiClick = (event, emojiObject) => {
  setReactions((prevReactions) => ({
    ...prevReactions,
    [uuid()]: emojiObject.emoji,
  }));
  setText((prevText) => prevText + emojiObject.emoji);
};

  return (
    <div className="Input">
      <button
        className="Emoji-Input-button"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      >
        <div className="Emoji-i">
          <i className="fa-solid fa-face-smile fa-2xl" style={{color: "#005eff"}}></i>
        </div>
      </button>
      <input
        className="Input-input"
        placeholder="Your Message..."
        onKeyDown={handleKeyDown}
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="Input-files">
        <input
          id="file"
          className="Input-i"
          type="file"
          style={{ display: "none" }}
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label className="Input-label" htmlFor="file">
          <i
            className="fa-solid fa-paperclip fa-xl"
            style={{ color: "#005eff"}}
          ></i>
        </label>
        <label className="Input-label" htmlFor="file">
          <i
            className="fa-solid fa-file-circle-plus fa-xl"
            style={{ color: "#005eff" }}
          ></i>
        </label>
        <label className="Input-label" onClick={startRecording}>
          <i className="fa-solid fa-microphone fa-xl" style={{color: "#005eff"}}></i>
        </label>
        <button className="Input-button" onClick={handleSend}>
            <i className="fa-solid fa-paper-plane fa-xl" style={{color: "#005eff"}}></i>
        </button>
      </div>
      {showEmojiPicker && (
        <div className="EmojiPicker">
          <EmojiPicker onEmojiClick={(emojiObject) => handleEmojiClick(undefined, emojiObject)} />
        </div>
      )}
    </div>
  );
};

export default Input;
