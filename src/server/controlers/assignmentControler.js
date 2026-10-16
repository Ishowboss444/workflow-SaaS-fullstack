import { prisma } from '../config/db.js';

class Assignment {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.user = req.user;
  }

  async create() {
    try {
      const { productId, workerId, quantity } = this.req.body;

      if (!productId || !workerId || !quantity)
        return this.res.status(400).json({
          status: 'failed',
          message: 'productId, workerId, and quantity are required',
        });

      const manager = await prisma.user.findUnique({
        where: { id: this.user.id },
      });

      if (!manager.workplaceId)
        return this.res.status(403).json({
          status: 'failed',
          message: 'you do not have a workplace',
        });

      const product = await prisma.product.findUnique({
        where: { id: Number(productId) },
      });

      if (!product || product.workplaceId !== manager.workplaceId)
        return this.res.status(404).json({
          status: 'failed',
          message: 'product not found in your workplace',
        });

      const worker = await prisma.user.findUnique({
        where: { id: Number(workerId) },
      });

      if (!worker || worker.workplaceId !== manager.workplaceId)
        return this.res.status(404).json({
          status: 'failed',
          message: 'worker not found in your workplace',
        });

      const totalAssigned = await prisma.assignment.aggregate({
        where: { productId: product.id },
        _sum: { quantity: true },
      });

      const currentTotal = totalAssigned._sum.quantity || 0;
      const newTotal = currentTotal + Number(quantity);

      if (newTotal > product.amount)
        return this.res.status(400).json({
          status: 'failed',
          message: 'total assigned quantity exceeds product amount',
        });

      const assignment = await prisma.assignment.create({
        data: {
          productId: product.id,
          workerId: worker.id,
          quantity: Number(quantity),
        },
      });

      return this.res.status(201).json({
        status: 'success',
        data: assignment,
      });
    } catch (err) {
      console.error(err);
      return this.res.status(500).json({
        status: 'failed',
        message: 'something went wrong',
      });
    }
  }
}

export default Assignment;
