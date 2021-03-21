"use strict";

const Course = require("../models/course");
const User = require('../models/user');
const httpStatus = require('http-status-codes');

module.exports = {
  index: (req, res, next) => {
    Course.find({})
      .then(courses => {
        res.locals.courses = courses;
        next();
      })
      .catch(error => {
        console.log(`Error fetching courses: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("courses/index");
  },
  new: (req, res) => {
    res.render("courses/new");
  },

  create: (req, res, next) => {
    let courseParams = {
      title: req.body.title,
      description: req.body.description,
      items: [req.body.items.split(",")],
      zipCode: req.body.zipCode
    };
    Course.create(courseParams)
      .then(course => {
        res.locals.redirect = "/courses";
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error saving course: ${error.message}`);
        next(error);
      });
  },

  show: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then(course => {
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("courses/show");
  },

  edit: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then(course => {
        res.render("courses/edit", {
          course: course
        });
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let courseId = req.params.id,
      courseParams = {
        title: req.body.title,
        description: req.body.description,
        items: [req.body.items.split(",")],
        zipCode: req.body.zipCode
      };

    Course.findByIdAndUpdate(courseId, {
      $set: courseParams
    })
      .then(course => {
        res.locals.redirect = `/courses/${courseId}`;
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error updating course by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let courseId = req.params.id;
    Course.findByIdAndRemove(courseId)
      .then(() => {
        res.locals.redirect = "/courses";
        next();
      })
      .catch(error => {
        console.log(`Error deleting course by ID: ${error.message}`);
        next();
      });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },

  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.OK,
      data: res.locals
    });
  },

  // ステータスコード500とJSONフォーマットのエラーメッセージで応答
  errorJSON: (error, req, res, next) => {
    const errorObject = {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error ? error.message : "Unknown Error"
    };

    res.json(errorObject);
  },

  // ユーザーをコースに参加させる
  join: async (req, res, next) => {
    const courseId = req.params.id;
    const currentUser = req.user;

    try {
      // 現在のユーザーがログインしているかをチェック
      if (currentUser) {
        await User.findByIdAndUpdate(currentUser, {
          $addToSet: {
            courses: courseId
          }
        });
        res.locals.success = true;
        next();
      } else {
        next(new Error('User must log in.'));
      }
    } catch (error) {
      // ログインしていなければ、エラーを次のミドルウェア関数に渡す
      next(error);
    }
  },

  filterUserCourses: (req, res, next) => {
    const currentUser = res.locals.currentUser;

    if (currentUser) {
      // コースデータにユーザーとの関連を示すフラグを加える
      const mappedCourses = res.locals.courses.map((course) => {
        // ユーザーのcourses配列に、そのコースが存在するかをチェック
        const userJoined = currentUser.courses.some(userCourse => userCourse.equals(course._id));
        return ({ ...course.toObject(), joined: userJoined });
      });
      res.locals.courses = mappedCourses;
    }
    next();
  }
};
