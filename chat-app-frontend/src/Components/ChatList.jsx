import React, { useCallback, useEffect } from "react";
import { getChatList } from "../service.js";
import { ChatState } from "../ChatProvider";

const ChatList = () => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${user.token}`,
  //   },
  // };

  const { chatList, updateChatlist, setSelectedChat, currentUserId } =
    ChatState();

  const showChatList = useCallback(async () => {
    try {
      const allChat = await getChatList({ currentUserId });

      if (allChat.data.status_code === "NO_CONVERSATION") {
        updateChatlist([]);
        return;
      }

      const sortedChatList = allChat.data.sort(
        (a, b) => new Date(b.chat.creationDate) - new Date(a.chat.creationDate)
      );
      updateChatlist(sortedChatList);
    } catch (error) {
      alert(error);
    }
  }, [currentUserId, updateChatlist]);

  useEffect(() => {
    showChatList();
  }, [currentUserId]);

  return (
    <div className="chatList">
      {!chatList ? (
        <p className="loading">Loading chats...</p>
      ) : chatList.length === 0 ? (
        <p className="no-chat">No chats yet</p>
      ) : (
        <ul>
          {chatList.map((chatItem) => (
            <li
              key={chatItem.chat._id}
              onClick={() => {
                setSelectedChat(chatItem);
              }}
            >
              <p>{chatItem?.user?.username}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatList;
