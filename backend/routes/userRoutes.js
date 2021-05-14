import express from 'express';
import {
  authUser,
  getUserProfile,
  registerUser,
  UpdateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  UpdateUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleWare.js';

const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, UpdateUserProfile);

router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, UpdateUser);

export default router;
