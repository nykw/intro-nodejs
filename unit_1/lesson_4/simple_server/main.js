const port = 3000;
const http = require('http')
const httpStatus = require('http-status-codes');
const app = http.createServer((req, res) => {
  console.log('Recieved an incoming request!');
  // クライアント対するレスポンスを書く
  res.writeHead(httpStatus.OK, {
    'Content-Type': 'text/html'
  });
  const responseMessage = '<h1>Hello, Universe!</h1>';
  res.write(responseMessage);
  res.end();
  console.log(`Sent a response: ${responseMessage}`);
});
// アプリケーションのサーバーにポート3000を監視させる
app.listen(port);
console.log(`The server has started and is listening on port number:${port}`);