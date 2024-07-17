import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import swal from "sweetalert";

const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    if (displayName.length > 7) {
      alert("Length of Username exceeds, Please try again!!");
      setLoading(false);
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErr(true);
      swal("Uh-Oh!", "Something Got Wrong! Please Try Again", "error");
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-image">
        <div className="register-form-box">
          <div className="register-form">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
              <div className="register-input-box">
                <input className='register-input' type="text" required />
                <label className='register-label'>Username</label>
              </div>
              <div className="register-input-box">
                <input className='register-input' type="email" required />
                <label className='register-label'>Email</label>
              </div>
              {loading && (
                <img className="loader" src="https://cdn.dribbble.com/users/530580/screenshots/4712372/loader.gif" alt="Loading..." />
              )}
              <div className="register-input-box">
                <input className='register-input' type="password" required />
                <label className='register-label'>Password</label>
              </div>
              <div className="register-input-box">
                <input className='register-input' type="file" id='file' style={{ display: "none" }}  />
                <label htmlFor='file'>
                  <img className='register-image1' src='https://www.kindpng.com/picc/m/3-39791_add-user-group-man-woman-icon-red-avatar.png' alt='avatar' />
                  <p className='register-p'>Add an avatar</p>
                </label>
              </div>
              <div className="register-group">
                <a href="/">Forgot Password</a>
                <Link to="/login">Login</Link>
              </div>
              <button type="submit" className='register-button'>Sign up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
