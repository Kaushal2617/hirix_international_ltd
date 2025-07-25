import dotenv from 'dotenv';
dotenv.config();
import express, { Application } from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import cartItemRoutes from './routes/cartItemRoutes';
import categoryRoutes from './routes/categoryRoutes';
import orderRoutes from './routes/orderRoutes';
import reviewRoutes from './routes/reviewRoutes';
import bannerRoutes from './routes/bannerRoutes';
import paymentRoutes from './routes/paymentRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import materialRoutes from './routes/materialRoutes';
import colorRoutes from './routes/colorRoutes';

const app: Application = express();

app.use(cors({
  origin: [
    'http://localhost:8080',
    'https://96a509c4ca60.ngrok-free.app'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart-items', cartItemRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/colors', colorRoutes);

// Example route
app.get('/', (req, res) => {
  res.send('API is running');
});

export default app;
