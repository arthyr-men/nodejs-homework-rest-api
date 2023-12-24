

const bcrypt = require("bcrypt");

const { Unauthorized } = require("http-errors");
const { NotFound } = require("http-errors");
const { SECRET_KEY } = process.env;
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();

    if (user) {
      res.status(409).json({ message:"Email in use"});
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
    });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).exec();
  
      if (!user) {
        throw new Unauthorized("Email or password is wrong");
      }
  
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        throw new Unauthorized("Email or password is wrong");
      }
  
      const payload = {
        id: user._id,
      };
  
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
      await User.findByIdAndUpdate(user._id, { token }).exec();
  
      res.json({
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  const getCurrent = async (req, res, next) => {
    try {
      const { email, subscription } = req.user;
  
      res.json({
        email,
        subscription,
      });
    } catch (error) {
      next(error);
    }
  };


const logout = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Unauthorized("Not authorized");
    }

    await User.findByIdAndUpdate(user._id, { token: null }).exec();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
    try {
      const { _id } = req.user;
  
      const result = await User.findByIdAndUpdate(_id, req.body, {
        new: true,
      });
  
      if (!result) {
        throw new NotFound("Not found");
      }
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
  
module.exports = {
    register,
    login,
    logout,
    getCurrent,
    updateSubscription,
  };