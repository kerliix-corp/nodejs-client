import express from 'express';
import { getProfile, userInfoRedirect } from '../controllers/profileController.js';

const router = express.Router();

router.get('/profile', getProfile);
router.get('/userinfo', userInfoRedirect);

export default router;
