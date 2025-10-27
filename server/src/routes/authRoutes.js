import express from 'express';
import { login, callback, logout } from '../controllers/authController.js';

const router = express.Router();

// Updated route to match frontend call
router.get('/kerliix', login);
router.get('/callback', callback); 
router.get('/logout', logout);

export default router;
