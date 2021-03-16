'use strict';

const express = require('express');
const app = express();
const homeController = require('./controllers/homeController');
const errorController = require('./controllers/errorController');
const layouts = require('express-ejs-layouts');

app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);
// bodyの解析でURLエンコーディングとJSONパラメータの処理を行う
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());
app.use(layouts);
// 静的アセット用の設定
app.use(express.static('public'));

// ホームページのルーティングを作る
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/courses', homeController.showCourses);
app.get('/contact', homeController.showSignUp);
app.post('/contact', homeController.postedSignUpForm);

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

// アプリケーションがポート3000を監視するように設定
app.listen(app.get('port'), () => {
  console.log(`Server running at http://localhost:${app.get('port')}`);
});
