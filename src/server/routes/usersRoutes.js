import express from 'express';
import authonticated from '../middlewae/authMiddleware.js';
import { prisma } from '../config/db.js';
import { Worker } from '../controlers/userControler.js';

const router = express.Router();

router.post('/', authonticated, async (req, res) => {
  const { username } = req.body;

  console.log(username);

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (!user)
    return res.status(402).json({
      status: 'failed',
      message: 'there is no user with this username',
    });
  if (user.id === req.user.id)
    return res.status(400).json({
      status: 'failed',
      message: 'this username belongs to YOU!',
    });

  return res.status(200).json({
    status: 'success',
    data: user,
  });
});
router.patch('/workerProfile', authonticated, async (req, res) => {
  const worker = new Worker(req, res);
  worker.updateWorker();
});

export default router;
