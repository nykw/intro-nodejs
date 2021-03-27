"use strict";

const Message = require('../models/message');
const { promisify } = require('util')

module.exports = io => {
  io.on("connection", async client => {
    console.log("new connection");

    // try {
    //   const messages = await promisify(Message.find({}).sort({
    //     createdAt: -1
    //   }).limit(10).then(messages => messages))();
    //   client.emit('load all messages', messages.reverse());
    // } catch (error) {
    //   console.log(error.message);
    // }

    Message.find({}).sort({
      createdAt: -1
    }).limit(10).then(messages => {
      client.emit('load all messages', messages.reverse());
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

      try {
        const m = new Message(messageAttributes);
        await m.save();
        io.emit("message", messageAttributes);
      } catch (error) {
        console.log(`${error.message}`);
      }
    });
  });
};
