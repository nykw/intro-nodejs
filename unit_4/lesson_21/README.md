# 演習：CRUDモデルを加える

## 演習の要件

- ユーザー、購読者、コースの、3つのモデルのためのスキーマ
- アプリケーションが持つ全てのモデルのためのCRUDアクション
- モデル間のリンクを示すビュー

## その他

- プロジェクトのディレクトリ構造

  ```text
  confetti_cuisine/
    models/
      user.js
      course.js
      subscriber.js
    views/
      users/
        index.ejs
        new.ejs
        show.ejs
        edit.ejs
      courses/
        index.ejs
        new.ejs
        show.ejs
        edit.ejs
      subscribers/
        index.ejs
        new.ejs
        show.ejs
        edit.ejs
    controllers/
      usersController.js
      coursesController.js
      subscribersCountroller.js
    public/
      images/
      js/
      css/
    main.js
  ```
