"use strict";

const usersController = require("../controllers/usersController");

const router = require("express").Router(),
  coursesController = require("../controllers/coursesController");

router.use(usersController.verifyToken);

router.get("/courses/:id/join", coursesController.join, coursesController.respondJSON);
router.get(
  "/courses",
  coursesController.index,
  coursesController.filterUserCourses,
  coursesController.respondJSON
);
router.use(coursesController.errorJSON);

module.exports = router;
