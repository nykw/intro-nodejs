"use strict";

const express = require("express"),
  app = express(),
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  layouts = require("express-ejs-layouts");

// MongoDBモジュールをロードする
const MongoDB = require('mongodb').MongoClient;
const dbURL = 'mongodb://localhost:27017';
const dbName = "recipe_db";

// ローカルデータベースサーバーへの接続を設定
MongoDB.connect(dbURL, (error, client) => {
  if (error) throw error;
  // MongoDBサーバーへの接続から、recipe_dbデータベースを取得
  const db = client.db(dbName);
  // contactsコレクションから全レコードを取り出す
  db.collection('contacts')
    .find()
    .toArray((error, data) => {
      if (error) throw error;
      console.log(data);
    });

  db.collection('contacts')
    .insertOne({
      name: 'Freddie Mercury',
      email: 'fred@queen.com'
    }, (error, data) => {
      if (error) throw error;
      console.log(data);
    });
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
