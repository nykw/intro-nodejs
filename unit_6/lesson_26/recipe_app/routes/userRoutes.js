const router = require('express').Router();
const usersController = require('../controllers/usersController');

router.get('/', usersController.index, usersController.indexView);

// 新規ユーザー作成
router.get('/new', usersController.new);
router.post('/create', usersController.validate, usersController.create, usersController.redirectView);

// ログインと認証
router.get('/login', usersController.login);
router.post('/login', usersController.authenticate);
router.get('/logout', usersController.logout, usersController.redirectView);

// ユーザーCRUD
router.get('/:id/edit', usersController.edit);
router.put('/:id/update', usersController.update, usersController.redirectView);
router.get('/:id', usersController.show, usersController.showView);
router.delete('/:id/delete', usersController.delete, usersController.redirectView);

module.exports = router;