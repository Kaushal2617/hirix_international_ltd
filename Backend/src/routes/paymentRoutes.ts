import { Router } from 'express';
import { createCheckoutSession } from '../controllers/paymentController';

const router = Router();

router.post('/create-checkout-session', createCheckoutSession);

export default router;
