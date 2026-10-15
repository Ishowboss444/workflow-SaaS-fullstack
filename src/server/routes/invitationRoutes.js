import express from 'express';
import authonticated from '../middlewae/authMiddleware.js';
import Invitation from '../controlers/invitationControler.js';
import authorization from '../middlewae/authorizationMiddleware.js';
const router = express.Router();

router.get('/get', authonticated, async (req, res) => {
  const invite = new Invitation(req, res);
  await invite.get();
});
router.patch('/:inviteId/accept', authonticated, async (req, res) => {
  const invite = new Invitation(req, res);
  await invite.accept();
});
router.patch('/:inviteId/reject', authonticated, async (req, res) => {
  const invite = new Invitation(req, res);
  await invite.reject();
});
router.post(
  '/send/:to',
  authonticated,
  authorization('MANAGER'),
  async (req, res) => {
    const invite = new Invitation(req, res);
    await invite.sender();
  }
);
export default router;
