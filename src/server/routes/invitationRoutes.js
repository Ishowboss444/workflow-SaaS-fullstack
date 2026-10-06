import express from 'express';
import authonticated from '../middlewae/authMiddleware.js';
import Invitation from '../controlers/invitationControler.js';
import authorization from '../middlewae/authorizationMiddleware.js';
const router = express.Router();

router.get('/get', authonticated, (req, res) => {
  const invite = new Invitation(req, res);
  invite.get();
});
router.patch('/:inviteId/accept', authonticated, (req, res) => {
  const invite = new Invitation(req, res);
  invite.accept();
});
router.patch('/:inviteId/reject', authonticated, (req, res) => {
  const invite = new Invitation(req, res);
  invite.accept();
});
router.post(
  '/send/:to',
  authonticated,
  authorization('MANAGER'),
  (req, res) => {
    const invite = new Invitation(req, res);
    invite.sender();
  }
);
export default router;
