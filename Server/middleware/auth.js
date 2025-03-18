const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  console.log('token..', token)
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided." });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(user.userId);
    if (!req.user) {
      return res.status(404).json({ message: "User not found." });
    }
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
