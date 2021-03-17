const mongoose = require('mongoose');
const Subscriber = require('./models/subscriber');

mongoose.connect(
  'mongodb://localhost:27017/recipe_db',
  { useNewUrlParser: true }
);

mongoose.connection;

const contacts = [
  {
    name: 'Jon Wexler',
    email: 'jon@jonwexler.com',
    zipCode: 10016
  },
  {
    name: 'Chef Eggplant',
    email: 'eggplant@recipeapp.com',
    zipCode: 20321
  },
  {
    name: 'Proffessor Souffle',
    email: 'souffle@recipeapp.com',
    zipCode: 19103
  }
];

// 既存のデータを全て削除する
Subscriber.deleteMany()
  .exec()
  .then(() => {
    console.log('Subscriber data is empty!');
  });

const commands = contacts.map(c =>
  Subscriber.create({
    name: c.name,
    email: c.email,
    zipCode: c.zipCode
  })
);

// プロミス解決後に、ログで確認する
Promise.all(commands)
  .then(r => {
    console.log(JSON.stringify(r));
    mongoose.connection.close();
  })
  .catch(error => {
    console.log(`ERROR:${error}`);
  });