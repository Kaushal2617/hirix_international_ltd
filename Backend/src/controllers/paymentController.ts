import { Request, Response } from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { cartItems, customerInfo } = req.body;
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'No cart items provided' });
    }

    // Map cart items to Stripe line items
    const line_items = cartItems.map((item: any) => ({
      price_data: {
        currency: process.env.STRIPE_CURRENCY || 'gbp',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100) // Stripe expects amount in pence/cents
      },
      quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer_email: customerInfo?.email,
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout?canceled=true`,
      metadata: {
        customerName: customerInfo?.firstName + ' ' + customerInfo?.lastName,
        customerId: customerInfo?.id || '',
      },
    });

    res.json({ url: session.url });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Stripe session creation failed' });
  }
};
