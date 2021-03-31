const assert = require('assert');

// 2. テスト仕様で指定された関数を実装する
const add = (x, y) => {
  return x + y;
};

// 1. アサートテストを書く
assert.equal(add(5, 4), 9, "5 plus 4 should equal 9");
assert.notEqual(add(5, 4), 0);