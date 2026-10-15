import express from 'express';
import { Auth } from '../controlers/authControler.js';
const router = express.Router();

router.post('/signup', async (req, res) => {
  const auth = new Auth(req, res);
  await auth.signup();
});
router.post('/login', async (req, res) => {
  const auth = new Auth(req, res);
  await auth.login();
});
router.post('/logout', (req, res) => {
  const auth = new Auth(req, res);
  auth.logout();
});

export default router;
