const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/keys");
const User = require("./Model/User");
const authUser = require("./Middleware/auth");

mongoose
  .connect(config.mongoDBUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((_) => console.log("DB Connected"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/api/users/register", (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then((data) => {
      res.json({
        user: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

app.post("/api/users/login", (req, res) => {
  // check email exists in db.
  User.findOne(
    {
      emailAddress: req.body.emailAddress,
    },
    (err, user) => {
      if (!user)
        return res
          .status(404)
          .json({ loginSuccess: false, message: "User not exists" });

      // compare password
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch) {
          return res.status(404).json({
            loginSuccess: false,
            message: "Incorrect Password",
          });
        }

        //generate jwt token and return with success message
        user.generateToken((token) => {
          res.cookie("x_auth", token).status(200).json({
            loginSuccess: true,
          });
        });
      });
    }
  );
});

app.get("/api/user/auth", authUser, (req, res) => {
  res.json({
    user: req.user,
  });
});
app.listen(5000, () => {
  console.log(`Server listening on ${5000}`);
});
