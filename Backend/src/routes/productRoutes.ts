import { Router } from 'express';
import * as productController from '../controllers/productController';
import { logProductRequest } from '../middlewares/productMiddleware';
import { authenticate, isAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.use(logProductRequest);

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', authenticate, isAdmin, productController.createProduct);
router.put('/:id', authenticate, isAdmin, productController.updateProduct);
router.delete('/:id', authenticate, isAdmin, productController.deleteProduct);
router.delete('/all', authenticate, isAdmin, productController.deleteAllProducts);

export default router; 