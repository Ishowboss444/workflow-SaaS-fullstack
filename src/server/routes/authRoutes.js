import express from 'express';
import {signup} from '../controlers/authControler.js';
const router = express.Router();

router.post('/register',signup);

export default router;