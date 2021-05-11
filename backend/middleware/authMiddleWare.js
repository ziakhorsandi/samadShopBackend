import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from './../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer')) {
    try {
      let tk = token.split(' ')[1];
      const decode = jwt.verify(tk, process.env.JWT_SECRET);
      req.user = await User.findById(decode.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
  if (token && !token.startsWith('Bearer')) {
    res.status(401);
    throw new Error('Sth with token is wrong');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};
export { protect, admin };
