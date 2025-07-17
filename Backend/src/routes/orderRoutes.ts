import { Router } from 'express';
import * as orderController from '../controllers/orderController';
import { logOrderRequest } from '../middlewares/orderMiddleware';
import { authenticate, isAdmin, isSelfOrAdmin, AuthRequest } from '../middlewares/authMiddleware';

const router = Router();

router.use(logOrderRequest);

router.get('/', authenticate, (req, res, next) => {
  const authReq = req as AuthRequest;
  // If admin, allow
  if (authReq.user?.role === 'admin') return next();
  // If user, only allow if requesting their own orders
  if (req.query.userId && String(authReq.user?.userId) === String(req.query.userId)) return next();
  return res.status(403).json({ error: 'Not authorized' });
}, orderController.getAllOrders);
router.get('/:id', authenticate, isSelfOrAdmin, orderController.getOrderById);
router.post('/', authenticate, orderController.createOrder);
router.put('/:id', authenticate, isSelfOrAdmin, orderController.updateOrder);
router.delete('/:id', authenticate, isSelfOrAdmin, orderController.deleteOrder);
router.delete('/all', authenticate, isAdmin, orderController.deleteAllOrders);

export default router; 