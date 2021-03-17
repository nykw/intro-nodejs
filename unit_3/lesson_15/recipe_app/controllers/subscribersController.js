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

module.exports.getSubscriptionPage = (req, res) => {
  res.render('contact');
};

module.exports.saveSubscriber = (req, res) => {
  const newSubscriber = new Subscriber({
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode
  });
  newSubscriber.save((error, result) => {
    if (error) res.send(error);
    res.render('thanks');
  });
};