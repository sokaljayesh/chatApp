const jwt = require("jsonwebtoken");
const { userModel } = require("./model/userModel.js");

const protect = async (req, res, next) => {
  let token;
  if (
    req.header.authorization &&
    req.header.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.header.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await userModel.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res
        .status(500)
        .json({ msg: "internal server error", status_code: "SERVER_ERROR" });
    }
  }
  if (!token) {
    res.status(401).json({ msg: "no token received", status_code: "NO_TOKEN" });
  }
};

module.exports = { protect };
