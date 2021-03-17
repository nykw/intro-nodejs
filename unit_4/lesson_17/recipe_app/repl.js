const mongoose = require('mongoose');
const Subscriber = require('./models/subscriber');

mongoose.connect(
  'mongodb://localhost:27017/recipe_db',
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;

Subscriber.create({ name: 'Jon', email: 'jon@jonwexler.com' }).then(data => { console.log(data); }).catch(error => console.log(error.message));
Subscriber.create({ name: 'nykw', email: 'nykw@example.com' }).then(data => { console.log(data); }).catch(error => console.log(error.message));
let sub;
Subscriber.findOne({ name: 'nykw' }).then(data => { console.log(data); sub = data; }).catch(err => console.log(err));
sub
sub.getInfo()
Subscriber.create({
  name: 'Jon',
  email: 'jon@jonwexler.com',
  zipCode: '12345'
}).then(subscriber => console.log(subscriber))
  .catch(err => console.log(err.message));

let subscriber;

Subscriber.findOne({
  name: 'Jon'
})
  .then(result => {
    subscriber = result;
    console.log(subscriber.getInfo());
  });

Subscriber.create({
  name: 'Jon',
  email: 'jon@jonwexler.com',
  zipCode: '12345'
}).then(subscriber => console.log(subscriber))
  .catch(err => console.log(err.message));

Subscriber.create({
  name: 'aa',
  email: 'aa',
  zipCode: 1341234321
}).then(data => console.log(data)).catch(err => console.log(err.message));
