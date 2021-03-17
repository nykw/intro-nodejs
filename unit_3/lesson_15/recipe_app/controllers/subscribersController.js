const Subscriber = require('../models/subscriber');

// 全ての購読者を取得する
module.exports.getAllSubscribers = (req, res, next) => {
  Subscriber
    .find({})
    .exec() // これが findクエリからのプロミスを返す
    .then((subscribers) => {
      res.render('subscribers', {
        subscribers: subscribers
      });
    })
    .catch((error) => {
      console.log(error);
      return [];
    })
    .finally(() => {
      console.log('promise complete');
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
  newSubscriber
    .save()
    .then((result) => {
      res.render('thanks');
    })
    .catch((error) => {
      if (error) res.send(error);
    });
};