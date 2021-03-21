const router = require('express').Router();
const coursesController = require('../controllers/coursesController');

router.get('/courses', coursesController.index, coursesController.respondJSON);
// APIのエラー処理ミドルウェアを追加
router.use(coursesController.errorJSON);

module.exports = router;