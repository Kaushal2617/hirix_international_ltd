import { Router } from 'express';
import * as wishlistItemController from '../controllers/wishlistItemController';
import { logWishlistItemRequest } from '../middlewares/wishlistItemMiddleware';
import { authenticate, isAdmin, isSelfOrAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.use(logWishlistItemRequest);

// Only keep /user routes
router.get('/user', wishlistItemController.getUserWishlist);
router.post('/user', wishlistItemController.setUserWishlist);
router.delete('/user', wishlistItemController.clearUserWishlist);

export default router; 