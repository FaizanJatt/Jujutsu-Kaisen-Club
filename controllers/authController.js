const User = require("../models/users");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.signup_get = (req, res, next) => {
  res.render("signUp");
};

exports.signup_post = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Username must be at least 6 characters"),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Password must be at least 6 charactgers"),
  body("confirmPassword")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Password must be at least 6 characters")
    .custom(async (value, { req }) => {
      // USING THE CUSTOM METHOD TO make sure both passwords are same, otherwise an error will be returned
      if (value !== req.body.password)
        throw new Error("Passwords must be the same");
      return true;
    }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);

      console.log("An Error has been found");
      return res.render("signUp", { error: "passwords must be the same" });
    }
    try {
      // check if user already exists, if it does then redirect to same page & show error
      const isUserInDB = await User.find({ username: req.body.username });
      if (isUserInDB.length > 0)
        return res.render("signUp", { error: "User already exists" });
      // If username does no exist , continue to register the user to the database
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) return next(err);
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
          member: false,
          admin: false,
        }).save((err) => (err ? next(err) : res.redirect("/")));
      });
    } catch (err) {
      return next(err);
    }
  },
];

exports.login_get = (req, res) => {
  // If user is already logged in , redirect them to homepage
  if (res.locals.currentUser) return res.redirect("/");
  res.render("logIn");
};
exports.login_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
});

exports.logout_get = (req, res) => {
  console.log("logging out");
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  console.log("finished logout");
  res.redirect("/");
};
