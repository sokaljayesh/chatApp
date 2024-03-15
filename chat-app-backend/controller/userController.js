const { userModel, groupModel,chatModel } = require("../model/userModel.js");

const getAllUser = async (req, res) => {
  try {
    const users = await userModel.find();
    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res
        .status(200)
        .json({ msg: "no user present", status_code: "NO_USER_PRESENT" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ msg: "internal server error", status_code: "SERVER_ERROR" });
  }
};


const createChat = async (req, res) => {
  try {
    const existingGroup = await groupModel
      .findOne({ member: req.body.member })
      .exec();

    if (existingGroup) {
      return res.status(400).json({
        msg: "Group with the same members already exists",
        status_code: "GROUP_ALREADY_EXIST",
      });
    }

    const newGroup = await groupModel.create({
      member: req.body.member,
      creationDate: req.body.creationDate,
    });

    if (newGroup) {
      const member_id = newGroup.member[1];
      try {
        const user = await getUserDetails(member_id);
        return res.status(201).json({
          msg: "Group created successfully",
          status_code: "GROUP_CREATED",
          groupDetail: { chat: newGroup, user },
        });
      } catch (error) {
        return res.status(500).json({
          msg: "Internal Server Error",
          status_code: "SERVER_ERROR",
        });
      }
    } else {
      return res.status(500).json({
        msg: "Group creation failed",
        status_code: "GROUP_CREATION_ERROR",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      msg: "Internal Server Error",
      status_code: "SERVER_ERROR",
    });
  }
};

const getUserDetails = async (member_id) => {
  try {
    const user = await userModel
      .findById(member_id, "username number email")
      .exec();
    return user;
  } catch (error) {
    throw error;
  }
};

const getAllChat = async (req, res) => {
  try {
    const chatList = await groupModel.find({ member: req.query.currentUserId });
    //console.log(req.query.currentUserId);
    if (chatList.length > 0) {
      const detailedChatList = await Promise.all(
        chatList.map(async (chat) => {
          const member_id = chat.member.find(
            (member) => member.toString() !== req.query.currentUserId
          );
          const user = await getUserDetails(member_id);
          //console.log(user);
          return { chat, user };
        })
      );

      return res.status(200).json(detailedChatList);
    } else {
      return res
        .status(200)
        .json({ msg: "NO Conversations Yet", status_code: "NO_CONVERSATION" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal Server Error", status_code: "SERVER_ERROR" });
  }
};

const getChat = async (req, res) => {
  const { currentUserId, chatWithUserId } = req.query;
  console.log(req.query);

  try {
    const chatMessages = await chatModel
      .find({
        $or: [
          {
            sentFrom: currentUserId,
            sentTo: chatWithUserId,
          },
          {
            sentFrom: chatWithUserId,
            sentTo: currentUserId,
          },
        ],
      })
      .sort({ timestamp: 1 }); 

    res.json(chatMessages);
  } catch (error) {
    console.error("Error retrieving chat messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const chat = async (req, res) => {
  const { currentUserId, chatWithUserId, text } = req.body;

  try {
    const newMessage = new chatModel({
      sentFrom: currentUserId,
      sentTo: chatWithUserId,
      message: text,
      timestamp: new Date(),
    });

    const savedMessage = await newMessage.save();
    console.log(`new message : ${savedMessage}`);
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error sending a chat message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getAllUser, createChat, getAllChat, getChat,chat };
