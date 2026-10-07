import express from 'express';
import authonticated from '../middlewae/authMiddleware.js';
import Workplace from '../controlers/workplaceControler.js';
import authorization from '../middlewae/authorizationMiddleware.js';

const router = express.Router();

router.post('/add', authonticated, (req, res) => {
  const workplace = new Workplace(req, res);
  workplace.add();
});
router.delete(
  '/delete/:workplaceId',
  authonticated,
  authorization('MANAGER'),
  (req, res) => {
    const workplace = new Workplace(req, res);
    workplace.delete();
  }
);

router.get('/:id/members', authonticated, (req, res) => {
  const id = req.params.id;
  const workplace = new Workplace(req, res);
  workplace.getMembers(id);
});

export default router;
