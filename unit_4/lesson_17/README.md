# メモ

## レッスンの概要

- モデルに妥当性検証を追加する
- モデルに、静的メソッドとインスタンスメソッドを作る
- モデルをREPLでテストする
- 複数のモデルにデータの関連付けを実装する

## その他

- Mongooseにおけるスキーマ型

  - 知っておくべきスキーマ型

    - `String`
    - `Date`
    - `Array`

      例： `[String]`, `[{type: mongoose.Schema.Types.ObjectId, ref: 'Subscriber'}]`

    - `Mixed`

      この型は、キーと値のペアをモデルに保存するので、JavaScriptのオブジェクトに最も近い型です。
      `mongoose.Schema.Types.Mixed` と指定します。

    - `ObjectId`

      MongoDBデータベースの各ドキュメントにある ObjectId 値と同じく、この型もオブジェクトの参照です。
      特に、モデルを他のモデルと関連付けるときは、この型が重要です。
      `mongoose.Schema.Types.ObjectId` と指定します。

- [Mongooseのインスタンスメソッド](https://mongoosejs.com/docs/guide.html#methods)

- Mongooseのクエリメソッド

  | クエリ | 説明 |
  | --- | :--- |
  | `find` | クエリのパラメータにマッチするレコードの配列を返す。 |
  | `findOne` | 一つのレコードを返す。 |
  | `findById` | データベースへのクエリを ObjectId で行う。 |
  | `remove` | データベースにあるドキュメントを削除できる。 |

- [`populate` の用例](https://mongoosejs.com/docs/populate.html)
