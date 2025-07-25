import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refetchUser,
  checkUser
} from '../controller/authcontroller.js'
import { VerifyToken } from '../middleware/verifiedtoken.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

router.get('/refetch', VerifyToken, refetchUser);
router.get('/check-user', VerifyToken, checkUser);

export default router;
