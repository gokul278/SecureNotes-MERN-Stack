const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: "String",
      require: true,
      unique: true,
      minlength: 8,
    },
    password: {
      type: "String",
      require: true,
      minlength: 8
    },
  },
  {
    timestamps: true,
  }
);

const userDB = mongoose.connection.useDb("Secure-Notes");

module.exports = userDB.model("Users", UserSchema);
