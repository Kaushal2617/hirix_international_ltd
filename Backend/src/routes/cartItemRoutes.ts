import { Router } from 'express';
import * as cartItemController from '../controllers/cartItemController';
import { logCartItemRequest } from '../middlewares/cartItemMiddleware';
import { authenticate, isAdmin, isSelfOrAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.use(logCartItemRequest);

// Only keep /user routes
router.get('/user', cartItemController.getUserCart);
router.post('/user', cartItemController.setUserCart);
router.delete('/user', cartItemController.clearUserCart);

export default router; 