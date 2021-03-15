const port = 3000;
const http = require('http');
const httpStatus = require('http-status-codes');
const router = require('./router');
const fs = require('fs');
const plainTextContentType = {
  'Content-Type': 'text/plain'
};
const htmlContentType = {
  'Content-Type': 'text/html'
};

// コードの重複を減らすために `readFile` 関数をカスタマイズ
const customReadFile = (file, res) => {
  fs.readFile(`./${file}`, (errors, data) => {
    if (errors) {
      console.log('Error reading the file...');
    }
    res.end(data);
  });
};

// getとpostで経路を登録する
router.get('/', (req, res) => {
  res.writeHead(httpStatus.OK, plainTextContentType)
  res.end('INDEX');
});
router.get('/index.html', (req, res) => {
  res.writeHead(httpStatus.OK, htmlContentType);
  customReadFile('views/index.html', res);
});
router.post('/', (req, res) => {
  res.writeHead(httpStatus.OK, plainTextContentType);
  res.end('POSTED');
});

// 全てのリクエストを router.jsを通じて処理する
http.createServer(router.handle).listen(port);
console.log(`The server is listening on port number: ${port}`);
