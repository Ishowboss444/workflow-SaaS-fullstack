import { AwardIcon } from 'lucide-vue-next';
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

      const products = await prisma.workplace.findUnique({
        where : {
          id : userExist.workplaceId,
        },
        include :{
          products : true,
        }
      })

      if (!products)
        return this.res(409).json({
          status: 'failed',
          message: 'went wrong',
        });

      this.res.status(201).json({
        status: 'success',
        data: products.products,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async addProduct() {
    const body = this.req.body;
    try {
      const userValid = await prisma.user.findUnique({
        where: {
          id: this.user.id,
        },
        include: {
          workplace: true,
        },
      });

      if (
        userValid.workplaceId !== this.body.workplaceId &&
        userValid.id == !this.user.id
      )
        return this.res.status(409).json({
          status: 'failed',
          message: "you're not the owner of this workplace",
        });

      const newProduct = await prisma.product.create({
        data: {
          name: this.body.name,
          description: this.body.name,
          colors: this.body.colors,
          amount: this.body.amount,
          workplaceId: this.body.workplaceId,
        },
      });
      this.res.status(201).json({
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
      console.log(err);
    }
  }
}
