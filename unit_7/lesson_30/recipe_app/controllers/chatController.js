module.exports = io => {
  // 新しいユーザーを監視する
  io.on('connection', client => {
    console.log("new connection");

    // ユーザーの切断を監視する
    client.on('disconnect', () => {
      console.log('user disconnect');
    });

    // カスタムメッセージイベントを監視する
    client.on('message', () => {
      // 接続中の全ユーザーにメッセージをブロードキャスト
      io.emit('message', {
        content: 'Hello'
      });
    });
  });
};