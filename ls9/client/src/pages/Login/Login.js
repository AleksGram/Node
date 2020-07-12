import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import "./Login.css";
import { api } from "../../data-provider";


export const Login = () => {
  let history = useHistory();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const fieldsHandlers = {
    email: setEmail,
    password: setPass
  };

  const submitHandler = (e) => {
    e.preventDefault();
    api.login({ email, password: pass })
      .then(({error, nik, role}) => {
        if (error) {
          let msg;
          if (typeof (error) === "string") {
            msg = error
          } else msg = error.message;
          setError(msg);
          return
        }
        history.push({pathname: "/messages"})
      })
  }

  const onChangeHandler = (field) => ({ target: { value } }) => {
    fieldsHandlers[field](value);
    setError("")
  }


  return (
    <div className="login-page">
      <h1>Welcome to Login page</h1>
      <form onSubmit={submitHandler} className="login-form">
        <label htmlFor="email">Enter your email:</label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={onChangeHandler("email")}

        />

        <label htmlFor="pass">Enter you password:</label>
        <input
          type="password"
          id="pass"
          name="pass"
          minLength={6}
          onChange={onChangeHandler("password")}
        />
        <div className="error">{error}</div>
        <input type="submit" value="Login" />
      </form>

    </div>
  )
}


