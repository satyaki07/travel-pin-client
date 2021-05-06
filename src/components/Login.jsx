import React, { useRef, useState } from "react";
import "./Login.css";
import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";

export default function Login({ setShowLogin, myStorage, setCurrentUser }) {
  const url = "https://travel-pin-app.herokuapp.com/api";
  const [error, setError] = useState(false);

  const nameRef = useRef();

  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post("/users/login", user);
      myStorage.setItem("user", res.data.username);
      setCurrentUser(res.data.username);
      setShowLogin(false);
      setError(false);
    } catch (error) {
      setError(true);
    }
  };
  return (
    <div className="loginContainer">
      <div className="logo">
        <Room />
        Travel Pin
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" ref={nameRef} />

        <input type="text" placeholder="Password" ref={passwordRef} />
        <button className="loginBtn">Login</button>

        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
}
