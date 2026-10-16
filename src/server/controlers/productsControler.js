import { prisma } from '../config/db.js';

export class Products {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.user = req.user;
    this.body = req.body;
  }

  async getProducts() {
    try {
      const userExist = await prisma.user.findUnique({
        where: {
          id: this.user.id,
        },
      });
      if (!userExist.workplaceId)
        return this.res.status(500).json({
          status: 'success',
          message: "you don't have any workplace",
        });

      const workplaceId = this.req.query.workplaceId
        ? Number(this.req.query.workplaceId)
        : userExist.workplaceId;

      const products = await prisma.product.findMany({
        where: {
          workplaceId: workplaceId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return this.res.status(200).json({
        status: 'success',
        data: products,
      });
    } catch (err) {
      console.error(err);
      return this.res.status(500).json({
        status: 'failed',
        message: 'something went wrong',
      });
    }
  }

  async getSpecificProducts(id) {
    try {
      const userExist = await prisma.user.findUnique({
        where: {
          id: this.user.id,
        },
      });
      const workplace = await prisma.workplace.findUnique({
        where: {
          id: userExist.workplaceId,
        },
      });
      if (userExist.id !== workplace.ownerId)
        return this.res.status(409).json({
          status: 'failed',
          message: 'you are not premitted',
        });

      const product = await prisma.product.findUnique({
        where: {
          id: id,
        },
      });

      return this.res.status(201).json({
        status: 'success',
        data: product,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async addProduct() {
    try {
      const userValid = await prisma.user.findUnique({
        where: {
          id: this.user.id,
        },
        include: {
          workplace: true,
        },
      });

      if (userValid.id !== userValid.workplace.ownerId)
        return this.res.status(403).json({
          status: 'failed',
          message: "you're not the owner of this workplace",
        });

      const newProduct = await prisma.product.create({
        data: {
          name: this.body.name,
          description: this.body.description ?? '',
          colors: this.body.colors,
          amount: this.body.amount,
          salary: this.body.salary,
          lines: this.body.lines,
          right_tailor: this.body.right_tailor,
          mid_tailor: this.body.mid_tailor,
          top_tailor: this.body.top_tailor,
          workplaceId: userValid.workplaceId,
        },
      });
      return this.res.status(201).json({
        status: 'success',
        data: {
          name: newProduct.name,
          description: newProduct.description,
          colors: newProduct.colors,
          amount: newProduct.amount,
          workplaceId: newProduct.workplaceId,
        },
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
