const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  member: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
