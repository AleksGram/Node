import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { api } from "../../data-provider";
import "./Registration.css";

export const Registration = () => {

  let history = useHistory();

  const [email, setEmail] = useState("");
  const [nik, setNik] = useState("");
  const [pass, setPass] = useState("");
  const [repeatPass, setrepeatPass] = useState("");
  const [error, setError] = useState("");

  const fieldsHandlers = {
    email: setEmail,
    password: setPass,
    repPass: setrepeatPass,
    nik: setNik
  };


  const submitHandler = (e) => {
    e.preventDefault();

    if (pass !== repeatPass) {
      setError("Passwords is not equal! Please repeat your password")
      return;
    }

    api.register({ email, password: pass, nik })
      .then((response) => {
        const { error } = response;
        if (error) {
          let msg;

          if (typeof (error) === "string") {
            msg = error
          } else msg = error.message;

          if (error.includes("E11000")) msg = "User with this email is registered already"

          setError(msg);
          return
        }
        history.push({ pathname: "/messages", state: { userName: nik } })
      })

  }

  const onChangeHandler = (field) => ({ target: { value } }) => {
    fieldsHandlers[field](value);
    setError("")
  }


  return (
    <div className="register-page">
      <h1>Registration page</h1>
      <form onSubmit={submitHandler} className="register-form">
        <label htmlFor="email">Enter your email:</label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={onChangeHandler("email")}
        />

        <label htmlFor="nik">Enter your nik name:</label>
        <input
          type="text"
          id="nik"
          name="nik"
          minLength={3}
          maxLength={100}
          onChange={onChangeHandler("nik")}
        />


        <label htmlFor="pass">Enter you password:</label>
        <input
          type="password"
          id="pass"
          name="pass"
          minLength={6}
          onChange={onChangeHandler("password")}
        />

        <label htmlFor="repeatPass">Repeat you password:</label>
        <input
          type="password"
          id="repeatPass"
          name="repeatPass"
          minLength={6}
          onChange={onChangeHandler("repPass")}
        />
        <div className="error">{error}</div>

        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

