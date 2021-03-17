const User = require('../models/user');

module.exports = {
  index: async (req, res) => {
    try {
      const users = await User.find({});
      res.render('users/index', {
        users
      })
    } catch (err) {
      console.log(`Error fetching users:${err.message}`);
      res.redirect('/');
    }
  }
}