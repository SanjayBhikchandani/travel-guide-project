const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    maxlength: 50,
  },
  emailAddress: {
    type: string,
    required: true,
    unique: 1,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
