import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  //const [user, setUser] = useState(null);
  const [chatList, setChatList] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentUserId, setCurrentUserId] = useState();
  const [currentUserName, setCurrentUserName] = useState();
  const navigator = useNavigate();

  const updateChatlist = (newValue) => {
    setChatList(newValue);
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userinfo"));
    if (userInfo) {
      const token = localStorage.getItem("userinfo");
      const [, payload] = token.split(".");
      const decodedPayload = JSON.parse(atob(payload));
      setCurrentUserName(decodedPayload.username.toUpperCase());
      setCurrentUserId(decodedPayload._id);
    }
    //setUser(userInfo);

    if (
      !userInfo &&
      !window.location.pathname.includes("/login") &&
      !window.location.pathname.includes("/signup")
    ) {
      navigator("/login");
    }
  }, [navigator]);

  return (
    <ChatContext.Provider
      value={{
        currentUserName,
        chatList,
        updateChatlist,
        selectedChat,
        setSelectedChat,
        currentUserId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
