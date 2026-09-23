import express from 'express';
import authonticated from '../middlewae/authMiddleware.js';
import Invitation from '../controlers/invitationControler.js';
import authorization from '../middlewae/authorizationMiddleware.js';
const router = express.Router();

router.get('/invites', authonticated, (req, res) => {
  const invite = new Invitation(req, res);
  invite.get();
});
router.get('/invites/:inviteId/accept', authonticated, (req, res) => {
  const invite = new Invitation(req, res);
  invite.accept();
});
router.post(
  '/send/invites/:to',
  authonticated,
  authorization('MANAGER'),
  (req, res) => {
    const invite = new Invitation(req, res);
    invite.sender();
  }
);
export default router;
