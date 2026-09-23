import { prisma } from '../config/db.js';

class Invitation {
  constructor(req, res) {
    this.res = res;
    this.req = req;
    this.id = req.user.id;
  }
  async sender() {
    try {
      const userId = Number(this.req.params.to);

      const isOwner = await prisma.user.findUnique({
        where: {
          id: this.id,
        },
      });

      const invitation = await prisma.invite.create({
        data: {
          workplaceId: isOwner.workplaceId,
          senderId: this.id,
          receiverId: userId,
        },
      });
      return this.res.status(200).json({
        status: 'success',
        data: {
          invitation,
        },
      });
    } catch (err) {
      return this.res(500).json({
        status: 'failed',
        message: 'unknown issue',
      });
    }
  }
  async get() {
    try {
      const isEmployed = await prisma.user.findUnique({
        where: {
          id: this.id,
        },
      });
      if (isEmployed.workplaceId)
        return this.res.status(404).json({
          status: 'failed',
          message: "you're already in a workplace",
        });

      const myInvites = await prisma.invite.findMany({
        where: {
          receiverId: this.id,
          status: 'PENDING',
        },
        include: {
          workplace: true,
          sender: true,
        },
      });
      return this.res.status(200).json({
        status: 'success',
        myInvites,
      });
    } catch (err) {
      return this.res.status(500).json({
        status: 'failed',
        message: 'something went wrong',
      });
    }
  }
  async accept() {
    try {
      const isEmployed = await prisma.user.findUnique({
        where: {
          id: this.id,
        },
      });
      if (isEmployed.workplaceId)
        return this.res.status(404).json({
          status: 'failed',
          message: "you're already in a workplace",
        });
      const invite = await prisma.invite.findUnique({
        where: {
          id: Number(this.req.params.inviteId),
        },
      });
      if (!invite)
        return this.res.status(409).json({
          status: 'failed',
          message: 'it seems there is no invitation with this id',
        });
      if (invite.receiverId !== this.id) {
        return this.res.status(403).json({
          status: 'failed',
          message: 'This invitation is not yours',
        });
      }

      if (invite.status !== 'PENDING') {
        return this.res.status(409).json({
          status: 'failed',
          message: 'This invitation is no longer pending',
        });
      }

      const acception = await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: {
            id: this.id,
          },
          data: {
            workplaceId: invite.workplaceId,
            role: 'WORKER',
          },
        });

        await tx.invite.update({
          where: {
            id: invite.id,
          },
          data: {
            status: 'ACCEPTED',
          },
        });
      });
      const workplace = await prisma.workplace.findUnique({
        where: {
          id: invite.workplaceId,
        },
        include: {
          members: true,
        },
      });
      return this.res.status(200).json({
        workplace,
        invite,
        acception,
      });
    } catch (err) {
      return this.res.status(409).json({
        status: 'failed',
        message: 'something went wrong',
      });
    }
  }
}

export default Invitation;
