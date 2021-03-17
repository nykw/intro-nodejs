const Subscriber = require('../models/subscriber');

// 全ての購読者情報を取り出す
module.exports.getAllSubscribers = (req, res) => {
  Subscriber.find({})
    .exec()
    .then((subscribers) => {
      res.render('subscribers', {
        subscribers: subscribers
      });
    })
    .catch((error) => {
      console.log(error.message);
      return [];
    })
    .finally(() => {
      console.log('promise complete.');
    });
};

// contactページを表示する
module.exports.getSubscriptionPage = (req, res) => {
  res.render('contact');
};

// 購読者情報を保存する
module.exports.saveSubscriber = (req, res) => {
  const newSubscriber = new Subscriber({
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode
  });

  newSubscriber.save()
    .then(() => {
      res.render('thanks');
    })
    .catch((error) => {
      res.send(error);
    });
};
