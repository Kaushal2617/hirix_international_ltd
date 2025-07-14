import { Router } from 'express';
import * as wishlistItemController from '../controllers/wishlistItemController';
import { logWishlistItemRequest } from '../middlewares/wishlistItemMiddleware';
import { authenticate, isAdmin, isSelfOrAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.use(logWishlistItemRequest);

router.get('/', authenticate, isAdmin, wishlistItemController.getAllWishlistItems);
router.get('/:id', authenticate, isSelfOrAdmin, wishlistItemController.getWishlistItemById);
router.post('/', authenticate, wishlistItemController.createWishlistItem);
router.put('/:id', authenticate, isSelfOrAdmin, wishlistItemController.updateWishlistItem);
router.delete('/:id', authenticate, isSelfOrAdmin, wishlistItemController.deleteWishlistItem);
router.delete('/all', authenticate, isAdmin, wishlistItemController.deleteAllWishlistItems);

export default router; 