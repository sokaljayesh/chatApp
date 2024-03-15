const {userModel} = require("../model/userModel.js");
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email }).exec();
    if (user) {
      if (user.password === req.body.password) {
        let payload = {
          _id : user._id,
          username : user.username,
          email : user.email,
          number : user.number,
        }
        let token = jwt.sign(payload,process.env.JWT_SECRET);
        return res.status(200).json({ msg: "Login Success", token });
      } else {
        return res.status(401).json({ msg: "Incorrect Password", status_code: "INCORRECT_PASSWORD" });
      }
    } else {
      return res.status(401).json({ msg: "User Doesn't Exist",status_code: "USER_DOESN'T_EXIST" });
    }
  } catch (err) {
    return res.status(500).json({ msg: "Something Went Wrong",status_code: "SERVER_ERROR" });
  }
};

const signup = async (req, res) => {
  try {
    const user = await userModel.findOne({$or : [{number: req.body.number},{email: req.body.email},{username : req.body.username}] }).exec();
    if (user) {
      return res
        .status(400)
        .json({ msg: "User Already Exist", status_code: "USER_ALREADY_EXIST" });
    }
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error", status_code: "SERVER_ERROR"});
  }

  userModel.create({
    username: req.body.username,
    email: req.body.email,
    number: req.body.number,
    password: req.body.password,
  })
    .then((user) => {
      let payload = {
        _id : user._id,
        username : user.username,
        email : user.email,
        number : user.number,
      }
      let token = jwt.sign(payload,process.env.JWT_SECRET);
      res.status(201).json({ msg: "User Created" , token })})
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ msg: "Something Went Wrong", error_code: "SERVER_ERROR" });
    });
};

module.exports = { signup, login };
