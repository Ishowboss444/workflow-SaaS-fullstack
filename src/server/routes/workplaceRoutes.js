import express from 'express';
import authonticated from '../middlewae/authMiddleware.js';
import Workplace from '../controlers/workplaceControler.js';
import authorization from '../middlewae/authorizationMiddleware.js';

const router = express.Router();

router.post('/add', authonticated, async (req, res) => {
  const workplace = new Workplace(req, res);
  await workplace.add();
});
router.delete(
  '/delete/:workplaceId',
  authonticated,
  authorization('MANAGER'),
  async (req, res) => {
    const workplace = new Workplace(req, res);
    await workplace.delete();
  }
);

router.get('/:id/members', authonticated, async (req, res) => {
  const id = Number(req.params.id);
  const workplace = new Workplace(req, res);
  await workplace.getMembers(id);
});

router.get('/:id/members/:memberId/assignments', authonticated, async (req, res) => {
  const id = Number(req.params.id);
  const memberId = Number(req.params.memberId);
  const workplace = new Workplace(req, res);
  await workplace.getMemberAssignments(id, memberId);
});

export default router;
