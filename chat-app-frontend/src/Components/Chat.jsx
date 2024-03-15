import React, { useState, useEffect, useCallback } from "react";
import { getChatMessages, sendChatMessage } from "../service";
import { ChatState } from "../ChatProvider";
import io from "socket.io-client";
import ScrollableChat from "./ScrollableChat";

const URL = "http://localhost:5000";
const socket = io.connect(URL, { transports: ["websocket"] });
var selectedChatCompare;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const {  selectedChat, currentUserId } = ChatState();

  const fetchMessages = useCallback(async () => {
    if (!selectedChat) return;
    try {
      const chatMessages = await getChatMessages(
        currentUserId,
        selectedChat.user._id
      );

      setMessages(chatMessages.data);
      socket.emit("join chat", selectedChat.chat._id);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [currentUserId, selectedChat]);

  const sendMessageHandler = useCallback(async () => {
    if (newMessage.trim() === "") {
      return;
    }

    try {
      const sentMessage = await sendChatMessage(
        currentUserId,
        selectedChat.user._id,
        newMessage
      );
      console.log(sentMessage.data);
      console.log(selectedChat);
      socket.emit("new message", sentMessage.data, selectedChat);
      setMessages([...messages, sentMessage.data]);

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [newMessage, currentUserId, selectedChat, messages]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat.chat;
  }, [fetchMessages, selectedChat.chat]);

  useEffect(() => {
    socket.emit("setup", currentUserId);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare
        
      ) {
        return;
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img alt="profile pic" src={require('../user.png')}/>
        <h2>{selectedChat.user.username}</h2>
      </div>
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-convo"><p>No Conversation</p></div>
        ) : <ScrollableChat messages={messages}/>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessageHandler();
          }}
        />
        <button onClick={sendMessageHandler}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
