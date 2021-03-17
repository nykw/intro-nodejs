const mongoose = require('mongoose');
const Subscriber = require('../models/subscriber');

module.exports.getAllSubscribers = (req, res, next) => {
  Subscriber.find({}, (error, subscribers) => {
    // エラーは次のミドルウェア関数に渡す
    if (error) next(error);
    // MongoDBから返されたデータを requestオブジェクトに設定する
    req.data = subscribers;
    next();
  });
};