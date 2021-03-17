"use strict";

const mongoose = require("mongoose");
const subscriberSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  zipCode: {
    type: Number,
    min: [10000, 'Zip code too short'],
    max: 99999
  }
});

// 購読者のフルネームを取得する
subscriberSchema.methods.getInfo = function () {
  return `Name:${this.name} Email:${this.email} Zip Code:${this.zipCode}`;
};

// 同じZIPコードを持つ購読者を見つける
subscriberSchema.methods.findLocalSubscribers = function () {
  return this.model('Subscriber')
    .find({ zipCode: this.zipCode })
    .exec();
};

module.exports = mongoose.model("Subscriber", subscriberSchema);
