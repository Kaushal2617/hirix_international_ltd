import { Router } from 'express';
import * as colorController from '../controllers/colorController';

const router = Router();

router.get('/', colorController.getAllColors);
router.post('/', colorController.createColor);

export default router; 