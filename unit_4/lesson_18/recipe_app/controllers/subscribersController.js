"use strict";

const Subscriber = require("../models/subscriber");

module.exports = {
  index: async (req, res, next) => {
    try {
      const subscribers = await Subscriber.find({}).exec()
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

  getSubscriptionPage: (req, res) => {
    res.render("contact");
  },
  saveSubscriber: (req, res) => {
    let newSubscriber = new Subscriber({
      name: req.body.name,
      email: req.body.email,
      zipCode: req.body.zipCode
    });
    newSubscriber
      .save()
      .then(result => {
        res.render("thanks");
      })
      .catch(error => {
        if (error) res.send(error);
      });
  }
};
