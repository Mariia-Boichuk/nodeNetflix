const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    username: { type: String, require: true, min: 4, unique: true },

    password: { type: String, require: true, min: 4 },

    favoriteFilms: { type: Array, default: [] },
    followings: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", usersSchema);
