// routes/auth.route.js

import express from 'express';
import {
  google,
  signOut,
  signin,
  signup,
  verifyEmail,
  resendVerificationCode ,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/resend-code', resendVerificationCode);
router.post('/google', google);
router.get('/signout', signOut);
router.post('/verify-email', verifyEmail); // New route for email verification

export default router;
