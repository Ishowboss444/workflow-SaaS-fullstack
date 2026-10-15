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
    const newProduct = new Products(req, res);
    await newProduct.addProduct();
  }
);
router.get('/get', authonticated, async (req, res) => {
  const products = new Products(req, res);
  await products.getProducts();
});
router.get('/:id/get', authonticated, authorization('MANAGER'), async (req, res) => {
  const id = Number(req.params.id);
  const products = new Products(req, res);
  await products.getSpecificProducts(id);
});

export default router;
