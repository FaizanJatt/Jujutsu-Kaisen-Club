const Message = require("../models/messages");

exports.index = async (req, res, next) => {
  try {
    const messages = await Message.find({})
      .sort([["timestamp", "descending"]])
      .populate("user");
    return res.render("index", { user: req.user, messages: messages });
  } catch (err) {
    return next(err);
  }
};
