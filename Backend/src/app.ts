import dotenv from 'dotenv';
dotenv.config();
import express, { Application } from 'express';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import cartItemRoutes from './routes/cartItemRoutes';
import categoryRoutes from './routes/categoryRoutes';
import orderRoutes from './routes/orderRoutes';
import reviewRoutes from './routes/reviewRoutes';
import wishlistItemRoutes from './routes/wishlistItemRoutes';
import bannerRoutes from './routes/bannerRoutes';

const app: Application = express();

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart-items', cartItemRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist-items', wishlistItemRoutes);
app.use('/api/banners', bannerRoutes);

// Example route
app.get('/', (req, res) => {
  res.send('API is running');
});

export default app;
