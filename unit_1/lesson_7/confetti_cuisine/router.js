const httpStatus = require('http-status-codes');
const contentTypes = require('./contentTypes');
const utils = require('./utils');

// routingの関数を入れるroutesオブジェクト
const routes = {
  'GET': {},
  'POST': {}
};

// リクエストを処理するhandle関数
module.exports.handle = (req, res) => {
  try {
    routes[req.method][req.url](req, res);
  } catch (e) {
    res.writeHead(httpStatus.OK, contentTypes.html);
    utils.getFile('views/error.html', res);
  }
};

// routing関数をマップするgetとpostの関数
module.exports.get = (url, action) => {
  routes['GET'][url] = action;
};
module.exports.post = (url, action) => {
  routes['POST'][url] = action;
};