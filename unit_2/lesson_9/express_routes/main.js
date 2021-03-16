const port = 3000;
const express = require('express');
const app = express();

// URLエンコードされたデータを解析する
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());

app.use((req, res, next) => {
  console.log(`request made to: ${req.url}`);
  next();
});

app.get('/items/:vegetable', (req, res) => {
  const veg = req.params.vegetable;
  res.send(`This is the page for ${veg}`);
});

app.post('/', (req, res) => {
  console.log(req.body);
  console.log(req.query);
  res.send('POST Successful!');
});

app.listen(port, () => {
  console.log(`Server running on port:${port}`);
});