const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://nodeDB:node123@mongocluster-ovgor.mongodb.net/travel_place?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((_) => console.log("DB Connected"));

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(5000, () => {
  console.log(`Server listening on ${5000}`);
});
