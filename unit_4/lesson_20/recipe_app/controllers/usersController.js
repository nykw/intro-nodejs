"use strict";

const { findByIdAndDelete } = require("../models/user");
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
  new: (req, res) => {
    res.render("users/new");
  },
  create: (req, res, next) => {
    let userParams = {
      name: {
        first: req.body.first,
        last: req.body.last
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode
    };
    User.create(userParams)
      .then(user => {
        res.locals.redirect = "/users";
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error saving user: ${error.message}`);
        next(error);
      });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => {
    res.render("users/show");
  },
  edit: async (req, res, next) => {
    const userId = req.params.id;
    try {
      const user = await User.findById(userId);
      res.render('users/edit', {
        user
      });
    } catch (err) {
      console.log(`Error fetching user by ID:${err.message}`);
      next();
    }
  },
  update: async (req, res, next) => {
    const userId = req.params.id;
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
      const user = await User.findByIdAndUpdate(userId, {
        $set: userParams
      });
      res.locals.redirect = `/users/${userId}`;
      res.locals.user = user;
      next();
    } catch (err) {
      console.log(`Error updating user by ID:${err.message}`);
      next(err);
    }
  },
  delete: async (req, res, next) => {
    const userId = req.params.id;

    try {
      await User.findByIdAndRemove(userId);
      res.locals.redirect = '/users';
      next();
    } catch (err) {
      console.log(`Error deleting user by ID:${err.message}`);
      next(err);
    }
  }
};
