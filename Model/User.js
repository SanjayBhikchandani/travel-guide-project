const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const secretKey = require("../config/keys").secretOrKeys;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    maxlength: 50,
  },
  emailAddress: {
    type: String,
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

// hash password before saving user in mongo-db.
UserSchema.pre("save", function (next) {
  var user = this;
  // hash password only if password field is modified
  // it prevents fired up on every field change
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) next(err);

      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// compare passwords
UserSchema.methods.comparePassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    if (err) return callback(err);

    callback(null, isMatch);
  });
};

// generate user token on successful login

UserSchema.methods.generateToken = function (callback) {
  var user = this;
  var token = jwt.sign(
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      role: user.role,
    },
    secretKey,
    { expiresIn: 3600 }
  );
  callback(token);
};

UserSchema.statics.findByToken = function (token, callback) {
  var user = this;
  jwt.verify(token, secretKey, function (err, decode) {
    if (err) callback(err);
    user.findOne(
      {
        _id: decode.id,
      },
      function (err, user) {
        if (err) callback(err);
        const userObj = {};
        userObj.id = user._id;
        userObj.firstName = user.firstName;
        userObj.lastName = user.lastName;
        userObj.emailAddress = user.emailAddress;
        userObj.role = user.role;
        callback(null, userObj);
      }
    );
  });
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
