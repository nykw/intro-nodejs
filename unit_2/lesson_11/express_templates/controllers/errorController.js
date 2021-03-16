const httpStatus = require('http-status-codes');

// エラー処理用のミドルウェアを追加
module.exports.logErrors = (error, req, res, next) => {
  console.error(error.stack);
  next(error); // errorを次のミドルウェア関数に渡す。
};

// ステータスコード404でレスポンス
module.exports.respondNoResourceFound = (req, res) => {
  const errorCode = httpStatus.NOT_FOUND;
  res.status(errorCode);
  res.sendFile(`./public/${errorCode}.html`, {
    root: './'
  });
};

// 全てのエラーをキャッチし、ステータスコード500でレスポンス
module.exports.respondInternalError = (error, req, res, next) => {
  const errorCode = httpStatus.INTERNAL_SERVER_ERROR;
  console.log(`ERROR occured:${error.stack}`);
  res.status(errorCode);
  res.send(`${errorCode} | Sorry, our application is experiencing a problem!`);
};