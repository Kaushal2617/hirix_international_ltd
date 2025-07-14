import { Router } from 'express';
import * as reviewController from '../controllers/reviewController';
import { logReviewRequest } from '../middlewares/reviewMiddleware';
import { authenticate, isAdmin, isSelfOrAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.use(logReviewRequest);

router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReviewById);
router.post('/', authenticate, reviewController.createReview);
router.put('/:id', authenticate, isSelfOrAdmin, reviewController.updateReview);
router.delete('/:id', authenticate, isSelfOrAdmin, reviewController.deleteReview);
router.delete('/all', authenticate, isAdmin, reviewController.deleteAllReviews);

export default router; 