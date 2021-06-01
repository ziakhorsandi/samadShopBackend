import express from 'express';
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  UpdateProduct,
  cerateProductReview,
  getTopProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleWare.js';

import { upload } from './uploadRoutes.js';

const router = express.Router();

router.route('/top').get(getTopProducts);
router
  .route('/')
  .get(getProducts)
  .post(protect, admin, upload.single('image'), createProduct);
router.route('/:id/reviews').post(protect, cerateProductReview);
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  // .put(protect, admin, UpdateProduct);
  .put(protect, admin, upload.single('image'), UpdateProduct);
router.get('/top', getTopProducts);

export default router;
