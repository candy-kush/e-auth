const mongoose = require("mongoose");
const { mongoConnection, toJSON, paginate } = require("../configs");

const userSchema = mongoose.Schema({
    email: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      trim: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: [
        "Male",
        "Female",
        "Other"
      ]
    },
    status: {
      type: String,
      enum: [
        "ACTIVE",
        "INACTIVE",
        "BLOCKED"
      ],
      default: "ACTIVE"
    },
    isLoggedIn: {
      type: Boolean,
      default: true
    },
    activeSessionCount: {
      type: Number
    }
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

const User = mongoConnection.mongoStatic.model(
  "User",
  userSchema,
  "users"
);

const UserSecondary = mongoConnection.secondaryMongoStatic.model(
  "User",
  userSchema,
  "users"
);

module.exports = { User, UserSecondary };
