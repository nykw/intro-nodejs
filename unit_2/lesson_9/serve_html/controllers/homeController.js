"use strict";

module.exports.sendReqParam = (req, res) => {
  const veg = req.params.vegetable;
  res.send(`This is the page for ${veg}`);
};