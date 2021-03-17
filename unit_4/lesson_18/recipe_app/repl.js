const mongoose = require('mongoose');
const User = require('./models/user');
const Subscriber = require('./models/subscriber');

mongoose.connect('mongodb://localhost:27017/recipe_db', { useNewUrlParser: true });
let testUser;
User.create({
  name: {
    first: 'Jon',
    last: 'Wexler'
  },
  email: 'jon@jonwexler.com',
  password: 'pass123'
})
  .then(user => {
    testUser = user;
    return Subscriber.findOne({
      email: user.email
    });
  })
  .then(subscriber => {
    testUser.subscribedAccount = subscriber;
    testUser.save()
      .then(user => console.log('user updated'))
  })
  .catch(err => console.log(err.message));
