import express from 'express';
import authonticated from '../middlewae/authMiddleware.js';
import authorization from '../middlewae/authorizationMiddleware.js';
import Assignment from '../controlers/assignmentControler.js';

const router = express.Router();

router.post(
  '/create',
  authonticated,
  authorization('MANAGER'),
  async (req, res) => {
    const assignment = new Assignment(req, res);
    await assignment.create();
  }
);

export default router;
