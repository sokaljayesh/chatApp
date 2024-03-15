import axios from "axios";
import config from "./config";

export const signIn = (param) => {
  return axios.post(config.BACKEND_URL + "user/signup", param);
};

export const login = (param) => {
    return axios.post(config.BACKEND_URL + "user/login", param);
  };


export const getUser = () => {
  return axios.get(config.BACKEND_URL + "getAllUser");
}

export const createChat = (param) => {
  return axios.post(config.BACKEND_URL + "createChat",param);
}

export const getChatList = (param) => {
  return axios.get(config.BACKEND_URL + "getAllChat",{params : param});
}

export const getChatMessages = (currentUserId, chatWithUserId) => {
  return axios.get(
    config.BACKEND_URL + "chat", {params : {currentUserId,chatWithUserId}}
  );
};


export const sendChatMessage = (currentUserId, chatWithUserId, text) => {
  return axios.post(config.BACKEND_URL + "chat", {
    currentUserId,
    chatWithUserId,
    text,
  });
};