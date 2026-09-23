import { prisma } from '../config/db.js';

class Workplace {
  constructor(req, res) {
    this.res = res;
    this.req = req;
    this.name = req.user.name;
    this.username = req.user.username;
    this.id = req.user.id;
  }
  async add() {
    try {
      const hasAdded = await prisma.workplace.findUnique({
        where: {
          ownerId: this.id,
        },
      });
      if (hasAdded)
        return this.res.status(409).json({
          status: 'failed',
          message: 'You already have an workplace for yourself',
        });
      const newWorkplace = await prisma.workplace.create({
        data: {
          name: this.req.body.name ?? `${this.name}'s workplace`,
          ownerId: this.id,
        },
        include: {
          members: true,
          owner: true,
          products: true,
        },
      });
      console.log(newWorkplace);
      const updateUser = await prisma.user.update({
        where: {
          id: this.id,
        },
        data: {
          workplaceId: newWorkplace.id,
          role: 'MANAGER',
        },
      });
      return this.res.status(200).json({
        status: 'success',
        data: {
          id: newWorkplace.id,
          name: newWorkplace.name,
          ownerId: newWorkplace.ownerId,
        },
        user: {
          id: updateUser.id,
          role: updateUser.role,
          workplace: updateUser.workplaceId,
        },
      });
    } catch (err) {
      console.log(`here is an error :${err}`);
    }
  }
  async delete() {
    const workplaceId = Number(this.req.params.workplaceId);
    const workplace = await prisma.workplace.findUnique({
      where: {
        id: workplaceId,
      },
      include: {
        owner: true,
      },
    });
    if (!workplace)
      return this.res.status(409).json({
        message: 'there is no workplace with this id',
      });
    if (workplace.owner.id === this.id) {
      await prisma.workplace.delete({
        where: {
          id: workplaceId,
        },
      });
      await prisma.user.update({
        where: {
          id: this.id,
        },
        data: {
          role: null,
        },
      });
    } else {
      return this.res.status(409).json({
        message: 'your forbidden to do this',
      });
    }
    this.res.status(200).json({
      message: 'you have done great',
      workplace,
      deletor: this.id,
    });
  }
}
export default Workplace;
