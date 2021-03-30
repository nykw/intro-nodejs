const Message = require("../models/message");

module.exports = io => {
  io.on('connection', client => {
    console.log("new connection");

    Message.find({})
      .sort({
        createdfAt: -1
      })
      .limit(10)
      .then(messages => {
        client.emit("load all messages", messages.reverse());
      });

    client.on("disconnect", () => {
      console.log("user disconnected");
    });

    client.on("message", async ({ content, userName, userId }) => {
      const messageAttributes = {
        content,
        userName,
        user: userId
      };

      const m = new Message(messageAttributes);

      try {
        await m.save();
        io.emit('message', messageAttributes);
      } catch (error) {
        console.log(`error:${error.message}`);
      }
    });
  });
};