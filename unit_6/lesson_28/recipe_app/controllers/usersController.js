"use strict";

const User = require("../models/user"),
  passport = require("passport"),
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
// const token = process.env.TOKEN || 'recipeT0k3n';
const jsonWebToken = require('jsonwebtoken');
const httpStatus = require('http-status-codes');

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
    if (req.skip) return next();
    let newUser = new User(getUserParams(req.body));
    User.register(newUser, req.body.password, (error, user) => {
      if (user) {
        req.flash("success", `${user.fullName}'s account created successfully!`);
        res.locals.redirect = "/users";
        next();
      } else {
        req.flash("error", `Failed to create user account because: ${error.message}.`);
        res.locals.redirect = "/users/new";
        next();
      }
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
    res.render("users/login");
  },
  authenticate: passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: "Failed to login.",
    successRedirect: "/",
    successFlash: "Logged in!"
  }),
  validate: (req, res, next) => {
    req
      .sanitizeBody("email")
      .normalizeEmail({
        all_lowercase: true
      })
      .trim();
    req.check("email", "Email is invalid").isEmail();
    req
      .check("zipCode", "Zip code is invalid")
      .notEmpty()
      .isInt()
      .isLength({
        min: 5,
        max: 5
      })
      .equals(req.body.zipCode);
    req.check("password", "Password cannot be empty").notEmpty();

    req.getValidationResult().then(error => {
      if (!error.isEmpty()) {
        let messages = error.array().map(e => e.msg);
        req.skip = true;
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/users/new";
        next();
      } else {
        next();
      }
    });
  },
  logout: (req, res, next) => {
    req.logout();
    req.flash("success", "You have been logged out!");
    res.locals.redirect = "/";
    next();
  },
  // verifyToken: async (req, res, next) => {
  //   const token = req.query.apiToken;
  //   try {
  //     if (token) {
  //       const user = await User.findOne({ apiToken: token });
  //       if (user) {
  //         next();
  //         return
  //       }
  //     }
  //     throw new Error('Invalid API token.');
  //   } catch (error) {
  //     next(new Error(error.message));
  //   }
  // },

  apiAuthenticate: async (req, res, next) => {
    try {
      // ユーザー認証をpassport.authenticateメソッドで行う
      const user = await new Promise((resolve) => {
        passport.authenticate('local', (error, user) => {
          if (error) throw error;
          resolve(user);
        })(req, res, next);
      });

      if (user) {
        // メールアドレスとパスワードの一致するユーザーがいたらJWTに署名する
        const signedToken = jsonWebToken.sign(
          {
            data: user._id,
            exp: new Date().setDate(new Date().getDate() + 1)
          },
          'secret_encoding_passphrase'
        );
        // JWTでレスポンスする
        res.json({
          success: true,
          token: signedToken
        });
      } else {
        throw new Error('Could not authenticate user');
      }
    } catch (error) {
      res.json({
        success: false,
        message: error.message
      });
    }
  },

  verifyJWT: async (req, res, next) => {
    const token = req.headers.token;

    if (token) {
      try {
        // JWTを認証し、ペイロードをデコードする
        const payload = await new Promise((resolve) => {
          jsonWebToken.verify(token, 'secret_encoding_passphrase', (errors, payload) => {
            if (errors) throw errors;
            resolve(payload);
          })
        });

        if (payload) {
          // JWTのペイロードからデコードされたIDと一致するユーザーを探す
          const user = await User.findById(payload.data);

          if (user) {
            // JWTのIDを持つユーザーがあったら次のミドルウェア関数を呼び出す
            next();
          } else {
            // ユーザーアカウントが見つからないときのエラーを返す
            res.status(httpStatus.FORBIDDEN).json({
              error: true,
              message: 'No User account found'
            });
          }
        } else {
          // トークンの認証に失敗したときのエラー処理
          res.status(httpStatus.UNAUTHORIZED).json({
            error: true,
            message: 'Cannot verify API token'
          });
          next();
        }
      } catch (error) {
        console.log(error.message);
        throw error;
      }
    } else {
      // リクエストヘッダにトークンがなかったときのエラー処理
      res.status(httpStatus.UNAUTHORIZED).json({
        error: true,
        message: 'Provide Token'
      });
    }
  }
};
