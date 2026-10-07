import { prisma } from '../config/db.js';

export class Worker {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.user = req.user;
  }

  async updateWorker() {
    const user = await prisma.user.findUnique({
      where: {
        username: this.user.username,
      },
    });
    if (user.workplaceId || user.field || user.role)
      return this.res.status(400).json({
        status: 'failed',
        message: 'you had sat your profile once',
      });

    const update = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          username: this.user.username,
        },
        data: {
          role: 'WORKER',
          field: this.req.body.field,
        },
      });
    });
    return this.res.status(200).json({
      status: 'failed',
      data: update,
    });
  }
}
