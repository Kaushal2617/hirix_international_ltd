import mongoose from 'mongoose';

// Replace with your actual connection string or ensure .env is loaded
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_db_name';

const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', productSchema, 'products');

async function fixProducts() {
  await mongoose.connect(MONGODB_URI);

  const result = await Product.updateMany(
    { $or: [ { color: { $exists: false } }, { material: { $exists: false } } ] },
    { $set: { color: '', material: '' } }
  );

  console.log(`Updated ${result.modifiedCount} products.`);
  await mongoose.disconnect();
}

fixProducts().catch(err => {
  console.error(err);
  process.exit(1);
}); 