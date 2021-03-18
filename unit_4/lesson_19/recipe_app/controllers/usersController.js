"use strict";

const User = require("../models/user");

module.exports = {
  index: (req, res, next) => {
    User.find()
      .then(users => {
        res.locals.users = users;
        next();
      })
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("users/index");
  },
  // フォームをレンダリングするnewアクションを追加
  new: (req, res) => {
    res.render('users/new');
  },
  // ユーザーをデータベースに保存する createアクションを追加
  create: async (req, res, next) => {
    const userParams = {
      name: {
        first: req.body.first,
        last: req.body.last
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode
    };

    try {
      const user = await User.create(userParams);
      res.locals.redirect = '/users';
      res.locals.user = user;
      next();
    } catch (err) {
      console.log(`Error saving user:${err.message}`);
      next(err);
    }
  },
  // ビューのレンダリング
  redirectView: (req, res, next) => {
    const redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  }
};
