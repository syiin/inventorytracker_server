require("dotenv").config({ path: "variables.env" });
const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res, next) => {
  let user = await User.create(req.body);
  let { username } = user;
  let token = jwt.sign(
    {
      username
    },
    process.env.SECRET_KEY
  );

  return res.status(200).json({
    username,
    token
  });
};

exports.signInUser = async (req, res, next) => {
  let user = await User.findOne({
    username: req.body.username
  });

  let { username, isAdmin } = user;
  let isMatch = await user.comparePassword(req.body.password);

  if (isMatch) {
    let token = jwt.sign(
      {
        username
      },
      process.env.SECRET_KEY
    );

    return res.status(200).json({
      username,
      isAdmin,
      token
    });
  }
};

exports.loginRequired = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (decoded) {
        next();
      } else {
        return next({ status: 401, message: "Please login first!" });
      }
    });
  } catch (err) {
    return next({ status: 401, message: "Please login first" });
  }
};

exports.isAdmin = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    const user = await User.find({ username: decoded.username });
    if (user[0].isAdmin) {
      next();
    } else {
      return next({ status: 401, message: "You must be an admin" });
    }
  });
};
