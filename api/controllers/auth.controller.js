// controllers/auth.controller.js

import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';
import { sendVerificationEmail } from '../utils/email.js';
import crypto from 'crypto';

// Signup Function
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return next(errorHandler(400, 'Email already exists!'));

    // Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Generate verification code
    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase(); // e.g., 'A1B2C3'

    // Set code expiration time (e.g., 1 hour)
    const codeExpiresAt = Date.now() + 3600000; // 1 hour in milliseconds

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verificationCode,
      codeExpiresAt,
    });

    // Save user to database
    await newUser.save();

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      success: true,
      message: 'User registered successfully! Please check your email for verification code.',
    });
  } catch (error) {
    next(error);
  }
};

// Verify Email Function
export const verifyEmail = async (req, res, next) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return next(errorHandler(404, 'User not found!'));

    if (user.isVerified) return next(errorHandler(400, 'Email is already verified.'));

    if (user.verificationCode !== code)
      return next(errorHandler(400, 'Invalid verification code.'));

    if (user.codeExpiresAt < Date.now())
      return next(errorHandler(400, 'Verification code has expired.'));

    user.isVerified = true;
    user.verificationCode = undefined;
    user.codeExpiresAt = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now sign in.',
    });
  } catch (error) {
    next(error);
  }
};

// Signin Function
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));

    if (!validUser.isVerified) return next(errorHandler(401, 'Please verify your email first.'));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    const { password: pass, verificationCode, codeExpiresAt, ...rest } = validUser._doc;

    res
      .cookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'strict' })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Existing google and signOut functions remain unchanged
// Resend Verification Code Function
export const resendVerificationCode = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return next(errorHandler(404, 'User not found!'));

    if (user.isVerified)
      return next(errorHandler(400, 'Email is already verified.'));

    // Generate new verification code
    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    const codeExpiresAt = Date.now() + 3600000; // 1 hour

    user.verificationCode = verificationCode;
    user.codeExpiresAt = codeExpiresAt;

    await user.save();

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({
      success: true,
      message: 'Verification code resent successfully!',
    });
  } catch (error) {
    next(error);
  }
};


export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};
