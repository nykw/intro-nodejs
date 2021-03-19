"use strict";

const mongoose = require("mongoose"),
  { Schema } = mongoose,
  bcrypt = require('bcrypt'),
  Subscriber = require("./subscriber");

const userSchema = new Schema(
  {
    name: {
      first: {
        type: String,
        trim: true
      },
      last: {
        type: String,
        trim: true
      }
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    zipCode: {
      type: Number,
      min: [1000, "Zip code too short"],
      max: 99999
    },
    password: {
      type: String,
      required: true
    },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    subscribedAccount: {
      type: Schema.Types.ObjectId,
      ref: "Subscriber"
    }
  },
  {
    timestamps: true
  }
);

userSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.subscribedAccount === undefined) {
    try {
      const subscriber = await Subscriber.findOne({
        email: user.email
      });
      user.subscribedAccount = subscriber;
      next();
    } catch (error) {
      console.log(`Error in connecting subscriber:${error.message}`);
      next(error);
    }
  } else {
    next();
  }
});

userSchema.pre('save', async function (next) {
  const user = this;

  try {
    // ユーザーのパスワードにハッシュをかける
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    next();
  } catch (error) {
    console.log(`Error in hashing password:${error.message}`);
    next(error);
  }
});

// ハッシュをかけたパスワード2つを比較する関数
userSchema.methods.passwordComparison = async function (inputPassword) {
  const user = this;
  return bcrypt.compare(inputPassword, user.password);
};

module.exports = mongoose.model("User", userSchema);
