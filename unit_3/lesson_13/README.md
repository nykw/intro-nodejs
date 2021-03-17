# MongoDBデータベースの準備

## レッスンの概要

- MongoDBのインストール
- MongoDBのシェルで行う、データの読み書き
- MongoDBをNode.jsアプリケーションに接続する

## その他

- [データベース概要](https://docs.oracle.com/javase/tutorial/jdbc/overview/database.html)

- [MongoDB Compass](https://www.mongodb.com/try#compass)

- MongoDBコマンド

  |コマンド | 説明 |
  | --- | --- |
  | `show collection` | データベース内のコレクションを、すべて表示します。これらのコレクションが、モデルとマッチすることになります。 |
  | `db.contacts.findOne` |データベース内のアイテムを1個、ランダムに選んで返すか、あるいは「`findOne({name:'Jon'})`」のように、パラメータとして渡された条件と一致する1個のアイテムを返します。 |
  | `db.contacts.update({name:"Jon"},{name:"Jon Wexler"})` |マッチするドキュメントを第2パラメータのプロパティの値で更新します。 |
  | `db.contacts.remove({name:"Jon Wexler"})` |マッチするドキュメントをコレクションから削除します。 |
  | `db.contacts.deleteMany({})` |このコレクションにあるドキュメントを、全て削除します。これらのコマンドはやり直しが効きません。|

- [MongoDBの薄い本](https://www.cuspy.org/diary/2012-04-17/the-little-mongodb-book-ja.pdf)
