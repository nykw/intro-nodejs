"use strict";

const express = require("express");
const app = express();
const errorController = require("./controllers/errorController");
const homeController = require("./controllers/homeController");
const subscribersController = require('./controllers/subscribersController');
const layouts = require("express-ejs-layouts");
const mongoose = require('mongoose');

// ES6のネイティブなプロミスを利用する
mongoose.Promise = global.Promise;

// データベース接続を設定
mongoose.connect(
  'mongodb://localhost:27017/recipe_db',
  { useNewUrlParser: true }
);
// データベースをdb変数に代入
const db = mongoose.connection;
// データベース接続時のメッセージをログに出力する
db.once('open', () => {
  console.log('Successfully connected to MongoDB using Mongoose!');
});

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(layouts);
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());
app.use(homeController.logRequestPaths);

app.get("/name", homeController.respondWithName);
app.get("/items/:vegetable", homeController.sendReqParam);
// リクエストを、getAllSubscribers関数に渡す
app.get('/subscribers', subscribersController.getAllSubscribers,
  (req, res, next) => {
    console.log(req.data);
    res.render('subscribers', {
      subscribers: req.data
    });
  });

app.get('/contact', subscribersController.getSubscriptionPage);
app.post('/subscribe', subscribersController.saveSubscriber);

app.post("/", (req, res) => {
  console.log(req.body);
  console.log(req.query);
  res.send("POST Successful!");
});

app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
