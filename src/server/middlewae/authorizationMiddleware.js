import { prisma } from '../config/db.js';

function authorization(role) {
  return async function (req, res, next) {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (user.role !== role) {
      return res.status(403).json({
        message: "you're not allowed to do this",
      });
    }

    next();
  };
}
export default authorization;
