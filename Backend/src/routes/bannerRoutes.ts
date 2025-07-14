import { Router } from 'express';
import * as bannerController from '../controllers/bannerController';
import { logBannerRequest } from '../middlewares/bannerMiddleware';
import { authenticate, isAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.use(logBannerRequest);

router.get('/', bannerController.getAllBanners);
router.get('/:id', bannerController.getBannerById);
router.post('/', authenticate, isAdmin, bannerController.createBanner);
router.put('/:id', authenticate, isAdmin, bannerController.updateBanner);
router.delete('/:id', authenticate, isAdmin, bannerController.deleteBanner);
router.delete('/all', authenticate, isAdmin, bannerController.deleteAllBanners);

export default router; 