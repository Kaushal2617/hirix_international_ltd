import { Router } from 'express';
import * as orderController from '../controllers/orderController';
import { logOrderRequest } from '../middlewares/orderMiddleware';
import { authenticate, isAdmin, isSelfOrAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.use(logOrderRequest);

router.get('/', authenticate, isAdmin, orderController.getAllOrders);
router.get('/:id', authenticate, isSelfOrAdmin, orderController.getOrderById);
router.post('/', authenticate, orderController.createOrder);
router.put('/:id', authenticate, isSelfOrAdmin, orderController.updateOrder);
router.delete('/:id', authenticate, isSelfOrAdmin, orderController.deleteOrder);
router.delete('/all', authenticate, isAdmin, orderController.deleteAllOrders);

export default router; 