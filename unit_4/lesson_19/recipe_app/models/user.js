"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;
const Subscriber = require('./subscriber');
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

// pre('save') hookを設定
userSchema.pre('save', async function (next) {
  const user = this;
  // すでに購読者との関連があるかチェック
  if (user.subscribedAccount === undefined) {
    try {
      const subscriber = await Subscriber.findOne({
        email: user.email
      });

      user.subscribedAccount = subscriber;
      next();
    } catch (err) {
      console.log(`Error in connecting subscriber:${err.message}`);
      next(err);
    }
  } else {
    // ユーザーに既存の関係がある場合
    next();
  }
})

module.exports = mongoose.model("User", userSchema);
