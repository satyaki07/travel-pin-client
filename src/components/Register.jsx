import React, { useRef, useState } from "react";
import "./Register.css";
import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";

export default function Register({ setShowRegister }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axios.post("/users/register", newUser);
      setError(false);
      setSuccess(true);
    } catch (error) {
      setError(true);
    }
  };
  return (
    <div className="registerContainer">
      <div className="logo">
        <Room />
        Travel Pin
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" ref={nameRef} />
        <input type="text" placeholder="Email" ref={emailRef} />
        <input type="text" placeholder="Password" ref={passwordRef} />
        <button className="registerBtn">Register</button>
        {success && (
          <span className="success">
            Registration Successful! You can login now.
          </span>
        )}
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <Cancel
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
}
