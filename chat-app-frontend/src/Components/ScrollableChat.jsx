import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import "./ScrollableChat.css";
import { ChatState } from "../ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { currentUserId } = ChatState();

  function formatTimestamp(timestamp) {
    const dateObj = new Date(timestamp);
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours %= 12;
    hours = hours || 12;
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    return `${hours}:${String(minutes).padStart(2, '0')} ${ampm} ${day}-${String(month).padStart(2, '0')}-${year}`;
  }
  
  

  return (
    <ScrollableFeed className="scrollable-feed-container">
      {messages.map((message, index) => (
        <div
          key={message._id}
          className={`message ${
            message.sentFrom === currentUserId ? "sentFrom" : "sentTo"
          }`}
        >
          <div className="message-content">{message.message}</div>
          <div className="message-timestamp">
            {formatTimestamp(message.timestamp)}
          </div>
        </div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
