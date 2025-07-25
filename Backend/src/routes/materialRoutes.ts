import { Router } from 'express';
import * as materialController from '../controllers/materialController';

const router = Router();

router.get('/', materialController.getAllMaterials);
router.post('/', materialController.createMaterial);

export default router; 