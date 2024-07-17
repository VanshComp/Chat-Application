import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import swal from "sweetalert";

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/")
    } catch (err) {
      setErr(true);
      swal("Uh-Oh!", "Something Got Wrong! Please Try Again", "error");
    }
  };
    return (
        <>
        <form onSubmit={handleSubmit}>
            <div className="ring">
                <i style={{ '--clr': '#00ff0a' }}></i>
                <i style={{ '--clr': '#ff0057' }}></i>
                <i style={{ '--clr': '#fffd44' }}></i>
                <div className="login">
                    <h2>Login</h2>
                    <div className="inputBx">
                        <input type="text" placeholder="Email" />
                    </div>
                    <div className="inputBx">
                        <input type="password" placeholder="Password" />
                    </div>
                    <div className="inputBx">
                        <input type="submit" value="Sign in" />
                    </div>
                    <div className="links">
                        <a href="/">Forget Password</a>
                        <Link to="/register">Register</Link>
                    </div>
                    {err && <p></p>}
                </div>
            </div>
        </form>
        </>
    )
}

export default Login
