const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: [true, "username already used"],
  },
  email: {
    type: String,
    required: true,
    unique: [true, "email is already registered"],
  },
  number: {
    type: String,
    required: true,
    max: [10, "invalid number"],
    min: [10, "invalid number"],
    unique: [true, "number already registered"],
  },
  password: { type: String, required: true },
});

const groupSchema = new Schema({
  member: { type: Array, required: true },
  creationDate: { type: Date, required: true },
});


const chatSchema = new Schema(
  {
    sentFrom: { type: Schema.Types.ObjectId, ref: "userModel", required: true },
    sentTo: { type: Schema.Types.ObjectId, ref: "userModel", required: true },
    timestamp: { type: Date, required: true },
    message: { type: String, trim : true },
    isGroup: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const userModel = mongoose.model("userModel", userSchema);
const groupModel = mongoose.model("groupModel", groupSchema);
const chatModel = mongoose.model("chatModel", chatSchema);

module.exports = { userModel, groupModel, chatModel };
