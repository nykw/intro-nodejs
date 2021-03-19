"use strict";

const { ReplSet } = require("mongodb");

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
    res.render("users/index", {
      flashMessages: {
        success: "Loaded all users!"
      }
    });
  },
  new: (req, res) => {
    res.render("users/new");
  },
  create: (req, res, next) => {
    if (req.skip) return next();

    let userParams = getUserParams(req.body);
    User.create(userParams)
      .then(user => {
        req.flash("success", `${user.fullName}'s account created successfully!`);
        res.locals.redirect = "/users";
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error saving user: ${error.message}`);
        res.locals.redirect = "/users/new";
        req.flash("error", `Failed to create user account because: ${error.message}.`);
        next();
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
      userParams = {
        name: {
          first: req.body.first,
          last: req.body.last
        },
        email: req.body.email,
        password: req.body.password,
        zipCode: req.body.zipCode
      };
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
  authenticate: async (req, res, next) => {
    try {
      const user = await User.findOne({
        email: req.body.email
      });

      // ユーザーが見つかったら
      if (user) {
        const passwordsMatch = await user.passwordComparison(req.body.password);

        // パスワードが一致したら
        if (passwordsMatch) {
          res.locals.redirect = `/users/${user._id}`;
          req.flash('success', `${user.fullName}'s logged in successfully!`);
          res.locals.user = user;
        } else {
          req.flash('error', 'Failed to log in user account: Incorrect Password.');
          res.locals.redirect = '/users/login';
        }
      } else {
        req.flash('error', 'Failed to log in user accont: User account not found.');
        res.locals.redirect = '/users/login';
      }

      next();
    } catch (err) {
      console.log(`Error logging in user:${err.message}`);
      next(err);
    }
  },
  validate: async (req, res, next) => {
    // email
    req.sanitizeBody('email')
      .normalizeEmail({
        all_lowercase: true
      }).trim();
    req.check('email', 'Email is invalid').isEmail();
    // zipCode
    req.check('zipCode', 'Zip code is invalid')
      .notEmpty()
      .isInt()
      .isLength({
        min: 5,
        max: 5
      })
      .equals(req.body.zipCode);
    // password
    req.check('password', 'Password cannot be empty')
      .notEmpty();

    try {
      const error = await req.getValidationResult();
      if (!error.isEmpty()) {
        const messages = error.array().map(e => e.msg);
        console.log(messages);
        req.skip = true;
        req.flash('error', messages.join(' and '));
        res.locals.redirect = '/users/new';
      }
      next();
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
};
