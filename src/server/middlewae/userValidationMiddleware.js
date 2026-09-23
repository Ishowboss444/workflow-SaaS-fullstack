import { prisma } from '../config/db.js';

async function validation(req, res, next) {
  const user = req.user;
  try {
    const userExist = await prisma.user.findUnique({
      where: { id: user.id },
    });
    if (!userExist) {
      return res.status(404).json({
        message: 'your account is no longer exist',
      });
    }
    next();
  } catch (err) {
    res.status(500).json({
      message: 'something went wrong',
    });
    next();
  }
}
export default validation;
