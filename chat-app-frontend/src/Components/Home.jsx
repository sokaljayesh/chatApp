import React, { useState } from "react";
import UserList from "./UserList";
import Button from "react-bootstrap/Button";
import ChatList from "./ChatList";
import Chat from "./Chat";
import { ChatState } from "../ChatProvider";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [show, setShow] = useState(false);
  const { currentUserName, selectedChat } = ChatState();
  const navigator = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("userinfo");
    navigator("/login");
  };

  return (
    <div className="home">
      <header className="searchHeader">
        <Button variant="primary" onClick={handleShow}>
          Search User
        </Button>
        <div className="appName">
          <img alt="app logo" src={require("../wechat.png")} />
          <p>ChatApp</p>
        </div>
        <div className="userProfile">
          <p>{currentUserName}</p>
        </div>
        <Button variant="primary" onClick={handleLogout}>
          Logout
        </Button>
      </header>
      {show && <UserList handleClose={handleClose} />}
      <div className="chatSection">
        <div className="leftSection">{currentUserName && <ChatList />}</div>
        <div className="rightSection">
          {selectedChat ? (
            <Chat />
          ) : (
            <div className="no-chat-selected">
              <p>Select a chat to start a conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
