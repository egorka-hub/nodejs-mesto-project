import { Router } from 'express';

import {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} from '../controllers/users';

import {
  validateUserId,
  validateUpdateProfile,
  validateUpdateAvatar,
} from '../validators/users';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateUpdateProfile, updateProfile);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

export default router;
