import { Router } from 'express';
import * as categoryController from '../controllers/categoryController';
import { logCategoryRequest } from '../middlewares/categoryMiddleware';
import { authenticate, isAdmin } from '../middlewares/authMiddleware';
import { upload } from '../utils/cloudinary';

const router = Router();

router.use(logCategoryRequest);

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', authenticate, isAdmin, categoryController.createCategory);
router.post('/upload-image', authenticate, isAdmin, upload.single('image'), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  res.json({ url: req.file.path });
});
router.put('/:id', authenticate, isAdmin, categoryController.updateCategory);
router.delete('/:id', authenticate, isAdmin, categoryController.deleteCategory);
router.delete('/all', authenticate, isAdmin, categoryController.deleteAllCategories);

export default router; 