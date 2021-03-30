module = io => {
  io.on('connection', client => {
    console.log("new connection");

    client.on("disconnect", () => {
      console.log("user disconnected");
    });

    client.on("message", ({ content, userName, userId }) => {
      const messageAttributes = {
        content,
        userName,
        user: userId
      };

      io.emit('message');
    });
  });
};