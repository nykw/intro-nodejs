const port = 3000;
const http = require('http')
const httpStatus = require('http-status-codes');

// 経路とレスポンスの対応を定義するマップ
const routeResponseMap = {
  '/info': '<h1>Info Page</h1>',
  '/contact': '<h1>Contact Us</h1>',
  '/about': '<h1>Learn More About Us</h1>',
  '/hello': '<h1>Say hello by emailing us <a href="#">here</a></h1>',
  '/error': "Sorry, the page you are looking for is not here."
};

const app = http.createServer((req, res) => {
  if (routeResponseMap[req.url] === '/error') {
    res.writeHead(httpStatus.NOT_FOUND);
    res.end(routeResponseMap["/error"]);
  } else {
    res.writeHead(httpStatus.OK, {
      'Content-Type': 'text/html'
    });

    // リクエストの経路がマップで定義されているかチェック
    if (routeResponseMap[req.url]) {
      res.end(routeResponseMap[req.url]);
    } else {
      res.end('<h1>Welcome!</h1>');
    }
  }
});

app.listen(port);
console.log(`The server has started and is listening on port number:${port}`);