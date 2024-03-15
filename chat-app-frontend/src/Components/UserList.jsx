import React, { useEffect, useCallback, useState } from "react";
import { getUser, createChat } from "../service";
import { ChatState } from "../ChatProvider";

const UserList = ({ handleClose }) => {
  const [users, setUsers] = useState([]);
  //const [userList, setUserList] = useState([]);
  const [searchedUser, setSearchedUser] = useState([]);

  const { chatList, updateChatlist, currentUserId, setSelectedChat } =
    ChatState();

  const getUsersDetails = useCallback(async () => {
    try {
      const user = await getUser();
      setUsers(user.data);
      //setUserList(user.data);
    } catch (err) {
      alert(err);
    }
  }, []);

  useEffect(() => {
    getUsersDetails();
  }, [getUsersDetails]);

  const searchUser = (e) => {
    console.log(e.target.value);
    if (e.target.value === "") {
      setSearchedUser([]);
      return;
    }
    const userSearched = users.filter(
      (user) =>
        user.username.toLowerCase().startsWith(e.target.value.toLowerCase())
    );

    //setUserList(searchedUser);
    setSearchedUser(userSearched);
  };

  const startChat = useCallback(
    async (e, _id) => {
      const member = [currentUserId, _id];

      try {
        let existingChat;
        if (chatList) {
          existingChat = chatList.find((chat) => {
            return (
              chat.chat.member.includes(currentUserId) &&
              chat.chat.member.includes(_id)
            );
          });
        }

        if (existingChat) {
          setSelectedChat(existingChat);

          handleClose();
        } else {
          const creationDate = new Date();
          const queryParam = { member, creationDate };
          const response = await createChat(queryParam);

          updateChatlist((chat) => [response.data.groupDetail, ...chat]);
          //check this line
          setSelectedChat(response.data.groupDetail);

          handleClose();
        }
      } catch (err) {
        console.log(err);
      }
    },
    [currentUserId, chatList, setSelectedChat, handleClose, updateChatlist]
  );

  return (
    <div className="user-list-modal">
      <div className="user-list-modal-content">
        <span className="close" onClick={handleClose}>
          &times;
        </span>
        <h2>Create Chat</h2>
        {users ? (
          <>
            <input
              type="text"
              name="searchUser"
              placeholder="Search user..."
              autoFocus
              onChange={searchUser}
            ></input>
            <ul>
              {searchedUser.map((user) => {
                const { username, _id } = user;
                return (
                  <li key={user._id} onClick={(e) => startChat(e, _id)}>
                    {username}
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          "Loading...."
        )}
      </div>
    </div>
  );
};

export default UserList;
