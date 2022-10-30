const Message = require("../models/messages");
const { body, validationResult } = require("express-validator");

exports.create_message_get = (req, res, ext) => {
  if (!res.locals.currentUser) {
    return res.redirect("/log-in");
  }
  res.render("message_form", { user: res.locals.currentUser });
};

exports.create_message_post = [
  body("messageTitle")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title must not be empty"),
  body("messageText")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Text must not be empty"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("message_form", { errors: errors.array() });
    }
    const message = new Message({
      user: req.user._id,
      title: req.body.messageTitle,
      text: req.body.messageText,
      timestamp: Date.now(),
    });
    await message.save((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  },
];
exports.delete_message_post = (req, res, next) => {
  // Remove the message using the id from the database
  Message.findByIdAndRemove(req.body.messageId, function deleteMessage(err) {
    if (err) return next(err);
    res.redirect("/");
  });
};
