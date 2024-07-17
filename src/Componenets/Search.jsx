import React, { useContext, useState } from "react";
import swal from 'sweetalert';
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { AuthContext } from "../Context/AuthContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const [photo,setPhoto]=useState("https://icon-library.com/images/add-user-icon/add-user-icon-6.jpg");

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    if (username.trim() === "") {
      setUser(null);
      return;
    }
  
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );
  
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        swal({
          title: "Oops!",
          text: "User Not Found!!!",
          icon: "error",
          button: "Try Again",
        });
      } else {
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        });
      }
    } catch (err) {
      setErr(true);
      swal({
        title: "Oops!",
        text: "An error occurred. Please try again.",
        icon: "error",
        button: "Try Again",
      });
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    if (!user) return;
    
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      swal({
        title: "Oops!",
        text: "An error occurred while selecting the user.",
        icon: "error",
        button: "Try Again",
      });
    }

    setUser(null);
    setUsername("")
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setUsername(newValue);
    if (newValue.trim() === "") {
      setUser(null);
    }
  };
  
  return (
    <div className="Search">
      <input
        className='Search-input'
        placeholder='My Contact'
        onKeyDown={handleKey}
        onChange={handleInputChange}
        value={username}
      />
      <i className="fa fa-magnifying-glass fa-lg" style={{color: "rgb(255,255,255,0.25)"}}></i>
      {user && (
        <div className="Search-found" onClick={handleSelect}>
          <img
            className='Search-image'
            src={user.photoURL}
          />
          <span className='Search-span'>{user.displayName}</span>
        </div>
      )}
    </div>
  );
}

export default Search;
