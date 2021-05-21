import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrdertoPaid,
  getMyOrders,
  getOrders,
  updateOrdertoDelivered,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleWare.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrdertoPaid);
router.route('/:id/deliver').put(protect, admin, updateOrdertoDelivered);

export default router;
