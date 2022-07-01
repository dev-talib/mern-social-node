const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "https://res.cloudinary.com/friend-zone/image/upload/v1656455514/default_avatar_an9yal.jpg",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      max: 50,
      default: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    profession: {
       type: String,
       default: "Update Profession"
    },
    address: {
      type: String,
      max: 50,
    },
    location: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
    isFollowing: {
      type: Boolean,
      default: false,
    },
    following: [
        {
            user:{ 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User' 
            },
        }

    ],
    followers: [
        {
            user:{ 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User' 
            },
        }
    ],

    },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
