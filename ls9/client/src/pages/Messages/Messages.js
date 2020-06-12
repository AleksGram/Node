import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";

import { api } from "../../data-provider";


export const Messages = () => {
  let history = useHistory();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMesssage] = useState("")
  const [user, setUser] = useState("");
  const [error, setError] = useState("");

  const listRef = useRef(null);

  const scrollToBottom = () => {
    const { scrollHeight } = listRef.current;
    listRef.current.scrollTo(0, scrollHeight);
  }

  useEffect(() => {

    api.getMessages()
      .then((data) => {
        if (data.error) {
          setError(data.error)
          setTimeout(() => history.push("/"), 1000)
          return;
        }
        setMessages(data.messages);
        setUser(data.user);
        scrollToBottom();
      })
  }, [messages.length, history])


  const onChangeHandler = ({ target: { value } }) => {
    setError("");
    setUserMesssage(value)
  }

  const sendMessage = () => {
    setError("");
    api.addMessage({ text: userMessage, autor: user.nik })
      .then(data => {
        if (data.error) {
          setError(data.error);
          setTimeout(() => {
            history.push("/")
          }, 1000)
          return
        }
        messages.push({ text: userMessage, autor: user.nik })
        setMessages([...messages])
        scrollToBottom();
        setUserMesssage("");
      })
      .catch(error => {
        setError("Something went wrong")
        console.log(error);
      })
  }

  const deleteMessageHandler = (id) => () => {
    setError("");
    api.deleteMessage(id)
      .then(data => {
        if (data.error) {
          setError(data.error)
          return
        }
        setMessages(messages.filter(m => m.id !== id));
      })
  }

  const onClickAllAccounts = () => history.push("/accounts")

  const onLogout = () => 
        api.logout()
        .then(data => {
          if(data.error) return setError(data.error);
          history.push("/login");
        })

  return (
    <div className="messages-container">
      <button onClick={onLogout}>LogOut</button>
      {user.role === "admin" && (<a onClick={onClickAllAccounts}>Show all accounts</a>)}
      <h1>{`Hi ${user.nik}`}</h1>
      <div className="message-date">
        <ul className="list" ref={listRef}>
          {messages.map(({ text, autor, id }, i) => (
            <li
              className="item"
              key={i}>
              {`${autor} : ${text}`}
              <div className="buttons">
                <span
                  className="delete"
                  onClick={deleteMessageHandler(id)}
                >
                  Delete
                  </span>
                <span className="edit">Edit</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="error">{error}</div>
        <div className="send-container">
          <textarea
            className="user-message"
            value={userMessage}
            onChange={onChangeHandler}
          />
          <span className="send" onClick={sendMessage}>Send</span>
        </div>
      </div>
    </div>
  )
}
