const User = require("../Model/User");
const authUser = (req, res, next) => {
  const token = req.cookies.x_auth;
  User.findByToken(token, (err, user) => {
    if (err)
      return res.status(500).json({
        message: err.message,
      });
    if (!user)
      return res.status(401).json({
        message: "Not authorized",
      });
    req.user = user;
    next();
  });
};
module.exports = authUser;
