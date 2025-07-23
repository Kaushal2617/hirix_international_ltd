import { Router } from 'express';
import * as wishlistController from '../controllers/wishlistController';
import { authenticate, isAdmin, isSelfOrAdmin } from '../middlewares/authMiddleware';

const router = Router();

// User-specific wishlist routes
router.get('/user', authenticate, wishlistController.getUserWishlist);
router.post('/user', authenticate, wishlistController.setUserWishlist);
router.delete('/user', authenticate, wishlistController.clearUserWishlist);
router.post('/user/add', authenticate, wishlistController.addWishlistItem);
router.post('/user/remove', authenticate, wishlistController.removeWishlistItem);

// Admin routes (optional)
router.get('/', authenticate, isAdmin, async (req, res) => {
  // List all wishlists (admin only)
  const { Wishlist } = await import('../models/Wishlist');
  const wishlists = await Wishlist.find();
  res.json(wishlists);
});

export default router; 