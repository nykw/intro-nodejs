const Subscriber = require('../models/subscriber');

const getSubscriberParams = (body) => ({
  name: body.name,
  email: body.email,
  zipCode: parseInt(body.zipCode)
});

module.exports = {
  // 全ての購読者ドキュメントを探し出す
  index: async (req, res, next) => {
    try {
      const subscribers = await Subscriber.find();
      res.locals.subscribers = subscribers;
      next();
    } catch (err) {
      console.log(`Error fetching subscribers:${err.message}`);
      next(err);
    }
  },
  indexView: (req, res) => {
    res.render('subscribers/index');
  },
  new: (req, res) => {
    res.render('subscribers/new')
  },
  create: async (req, res, next) => {
    const subscriberParams = getSubscriberParams(req.body);

    try {
      const subscriber = await Subscriber.create(subscriberParams);
      res.locals.redirect = '/subscribers';
      res.locals.subscriber = subscriber;
      next();
    } catch (err) {
      console.log(`Error saving subscriber:${err.message}`);
      next(err);
    }
  },
  redirectView: (req, res, next) => {
    const redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  // 購読者のデータを表示する
  show: async (req, res, next) => {
    const subscriberId = req.params.id;

    try {
      const subscriber = await Subscriber.findById(subscriberId);
      res.locals.subscriber = subscriber;
      next();
    } catch (err) {
      console.log(`Error fetching subscriber by ID:${err.message}`);
      next(err);
    }
  },
  showView: (req, res) => {
    res.render('subscribers/show');
  },
  // 購読者データの編集を行う
  edit: async (req, res, next) => {
    const subscriberId = req.params.id;

    try {
      const subscriber = await Subscriber.findById(subscriberId);
      res.render('subscribers/edit', {
        subscriber
      });
    } catch (err) {
      console.log(`Error fetching subscriber by ID:${err.message}`);
      next(err);
    }
  },
  // 既存の購読者ドキュメントに新しい値をセットする
  update: async (req, res, next) => {
    const subscriberId = req.params.id;
    const subscriberParams = getSubscriberParams(req.body);

    try {
      const subscriber = await Subscriber.findByIdAndUpdate(subscriberId, {
        $set: subscriberParams
      });
      res.locals.redirect = `/subscribers/${subscriberId}`;
      res.locals.subscriber = subscriber;
      next();
    } catch (err) {
      console.log(`Error updating subscriber by ID:${err.message}`);
      next(err);
    }
  },
  // 購読者のドキュメントを削除する
  delete: async (req, res, next) => {
    const subsciberId = req.params.id;

    try {
      await Subscriber.findByIdAndDelete(subsciberId);
      res.locals.redirect = '/subscribers';
      next();
    } catch (err) {
      console.log(`Error deleting subscriber by ID:${err.message}`);
      next(err);
    }
  }
};