import express from 'express';
import authonticated from '../middlewae/authMiddleware.js';
import authorization from '../middlewae/authorizationMiddleware.js';
import { Products } from '../controlers/productsControler.js';
const router = express.Router();

router.post(
  '/add',
  authonticated,
  authorization('MANAGER'),
  async (req, res) => {
    const newProduct = new Products(req,res)
    newProduct.addProduct()
  }
);
router.get('/get', authonticated, (req, res) => {
    const products = new Products(req,res)
    products.getProducts()
});

export default router;
