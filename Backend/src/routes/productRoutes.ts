import { Router } from 'express';
import * as productController from '../controllers/productController';
import { logProductRequest } from '../middlewares/productMiddleware';
import { authenticate, isAdmin } from '../middlewares/authMiddleware';
import { upload } from '../utils/cloudinary';
import { Request } from 'express';

const router = Router();

router.use(logProductRequest);

// Search suggestions endpoint
router.get('/search/suggestions', productController.getSearchSuggestions);

router.get('/', productController.getAllProducts);
router.get('/admin/all', authenticate, isAdmin, productController.getAllProductsAdmin);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id', productController.getProductById);
router.post('/', authenticate, isAdmin, productController.createProduct);
router.put('/:id', authenticate, isAdmin, productController.updateProduct);
router.delete('/:id', authenticate, isAdmin, productController.deleteProduct);
router.delete('/all', authenticate, isAdmin, productController.deleteAllProducts);
router.post('/upload-image', authenticate, isAdmin, upload.single('image'), (req, res) => {
  const file = (req as Request & { file?: any }).file;
  if (!file || !file.path) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  res.json({ url: file.path });
});

export default router; 