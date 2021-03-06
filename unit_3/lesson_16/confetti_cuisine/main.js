"use strict";

const express = require("express"),
  app = express(),
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  subscriberController = require('./controllers/subscribersController'),
  layouts = require("express-ejs-layouts");


const mongoose = require('mongoose');
mongoose.connect(
  'mongodb://localhost:27017/confetti_cuisine',
  { useNewUrlParser: true }
);

// プロミスチェーンのサポート
mongoose.Promise = global.Promise;

app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());
app.use(layouts);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/courses", homeController.showCourses);
app.get("/contact", homeController.showSignUp);

app.get('/subscribers', subscriberController.getAllSubscribers);
app.get('/contact', subscriberController.getSubscriptionPage);
app.post('/subscribe', subscriberController.saveSubscriber);

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
