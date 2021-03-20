"use strict";

const User = require("../models/user"),
  getUserParams = body => {
    return {
      name: {
        first: body.first,
        last: body.last
      },
      email: body.email,
      password: body.password,
      zipCode: body.zipCode
    };
  };

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

  create: async (req, res, next) => {
    if (req.skip) next();

    const newUser = new User(getUserParams(req.body));

    try {
      const user = await new Promise((resolve) => {
        User.register(newUser, req.body.password, (e, user) => {
          if (e) throw e;
          resolve(user);
        });
      });

      if (user) {
        req.flash('success', `${user.fullName}'s account created successfully!`);
        res.locals.redirect = '/users';
      } else {
        throw new Error('user not found');
      }
    } catch (error) {
      req.flash('error', `Failed to create user account because:${error.message}`);
      req.locals.redirect = `/users/new`;
    }
    next();
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
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

  edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        res.render("users/edit", {
          user: user
        });
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let userId = req.params.id,
      userParams = getUserParams(req.body);

    User.findByIdAndUpdate(userId, {
      $set: userParams
    })
      .then(user => {
        res.locals.redirect = `/users/${userId}`;
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let userId = req.params.id;
    User.findByIdAndRemove(userId)
      .then(() => {
        res.locals.redirect = "/users";
        next();
      })
      .catch(error => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next();
      });
  },

  login: (req, res) => {
    res.render('users/login');
  },
  validate: async (req, res, next) => {
    // email
    req
      .sanitizeBody('email')
      .normalizeEmail({
        all_lowercase: true
      })
      .trim();
    req.check('email', 'Email is invalid').isEmail();
    // zip code
    req
      .check('zipCode', 'Zip code is invalid')
      .notEmpty()
      .isInt()
      .isLength({
        min: 5,
        max: 5
      })
      .equals(req.body.zipCode);
    // password
    req.check('password', 'Password cannot be empty').notEmpty();

    try {
      const error = await req.getValidationResult();
      if (!error.isEmpty()) {
        const messages = error.array().map(e => e.msg);
        req.skip = true;
        req.flash('error', messages.join(" and "));
        res.locals.redirect = '/users/new';
      }
      next();
    } catch (e) {
      next(e);
    }
  }
};
