import { Router } from 'express';
import * as userController from '../controllers/userController';
import { logUserRequest } from '../middlewares/userMiddleware';
import * as authController from '../controllers/authController';
import { authenticate, isAdmin, isSelfOrAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.use(logUserRequest);

router.post('/auth/register', authController.register);
router.post('/auth/verify-otp', authController.verifyOtp);
router.post('/auth/login', authController.login);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);

router.get('/', authenticate, isAdmin, userController.getAllUsers);
router.get('/:id', authenticate, isSelfOrAdmin, userController.getUserById);
router.post('/', authenticate, isAdmin, userController.createUser);
router.put('/:id', authenticate, isSelfOrAdmin, userController.updateUser);
router.delete('/:id', authenticate, isSelfOrAdmin, userController.deleteUser);
router.delete('/all', authenticate, isAdmin, userController.deleteAllUsers);

export default router; 