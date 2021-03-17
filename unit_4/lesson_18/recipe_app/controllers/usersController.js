const User = require('../models/user');

module.exports = {
  index: async (req, res, next) => {
    try {
      const users = await User.find({});
      // ユーザーデータをレスポンスに格納し、次のミドルウェア関数を呼び出す
      res.locals.users = users;
      next();
    } catch (err) {
      console.log(`Error fetching users:${err.message}`);
      next(err);
    }
  },
  indexView: (req, res) => {
    res.render('users/index');
  }
}