const httpStatus = require('http-status-codes')
const htmlContentType = {
  'Content-Type': 'text/html'
};

// POSTとGETのリクエストに対応する経路を格納するroutesオブジェクトを定義
const routes = {
  'GET': {
    '/info': (req, res) => {
      res.writeHead(httpStatus.OK, {
        'Content-Type': 'text/plain'
      });
      res.end('Welcome to the Info Page!')
    }
  },
  'POST': {}
};

// 経路のコールバック関数を処理する handle 関数を作る
module.exports.handle = (req, res) => {
  try {
    if (routes[req.method][req.url]) {
      routes[req.method][req.url](req, res);
    } else {
      res.writeHead(httpStatus.NOT_FOUND, htmlContentType);
      res.end('<h1>No such file exists</h1>');
    }
  } catch (ex) {
    console.log(`error: ${ex}`);
  }
};

// main.jsから経路を登録するために、GETとPOSTの関数を作る
module.exports.get = (url, action) => {
  routes['GET'][url] = action;
};
module.exports.post = (url, action) => {
  routes['POST'][url] = action;
};