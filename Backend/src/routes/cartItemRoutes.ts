import { Router } from 'express';
import * as cartItemController from '../controllers/cartItemController';
import { logCartItemRequest } from '../middlewares/cartItemMiddleware';
import { authenticate, isAdmin, isSelfOrAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.use(logCartItemRequest);

router.get('/', authenticate, isAdmin, cartItemController.getAllCartItems);
router.get('/:id', authenticate, isSelfOrAdmin, cartItemController.getCartItemById);
router.post('/', authenticate, cartItemController.createCartItem);
router.put('/:id', authenticate, isSelfOrAdmin, cartItemController.updateCartItem);
router.delete('/:id', authenticate, isSelfOrAdmin, cartItemController.deleteCartItem);
router.delete('/all', authenticate, isAdmin, cartItemController.deleteAllCartItems);
router.get('/user', authenticate, cartItemController.getUserCart);
router.post('/user', authenticate, cartItemController.setUserCart);
router.delete('/user', authenticate, cartItemController.clearUserCart);

export default router; 