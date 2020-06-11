const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/keys");

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

app.listen(5000, () => {
  console.log(`Server listening on ${5000}`);
});
