import React, { useState, useEffect } from 'react';
import Footer from "../components/shared/Footer";
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, Truck, Shield, RotateCcw, Heart, Share2, CheckCircle, Palette, Layers, Tag, Info, User, Sparkles, Sofa } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem as addToCart } from '@/store/cartSlice';
import { addItem as addToWishlist } from '@/store/wishlistSlice';
import { toast } from '@/components/ui/use-toast';
import ProductGallery from '@/components/product/ProductGallery';
import { allProducts } from '@/data/products';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { fetchProducts } from '@/store/productSlice';
import type { AppDispatch } from '@/store';
import ReviewDialog from '@/components/orders/ReviewDialog';

const ProductPage = () => {
  const { productId } = useParams();
  const { products, loading, error } = useSelector((state: any) => state.products);
  const product = products.find((p: any) => (p._id || p.id)?.toString() === productId);
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const { user } = useSelector((state: any) => state.auth);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  // Variant selection state
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const hasVariants = product && Array.isArray(product.variants) && product.variants.length > 0;
  const selectedVariant = hasVariants
    ? product.variants.find((v: any) => v.id === selectedVariantId) || product.variants[0]
    : null;

  // Helper to get unique values for dropdowns
  const getUnique = (arr: any[], key: string) => Array.from(new Set(arr.map(item => item[key])));

  // When product changes, reset variant selection
  useEffect(() => {
    if (hasVariants) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [productId]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, productId]);

  useEffect(() => {
    if (!productId) return;
    setReviewsLoading(true);
    setReviewsError(null);
    fetch(`/api/reviews?productId=${productId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch reviews');
        return res.json();
      })
      .then(data => {
        setReviews(data);
        setReviewsLoading(false);
      })
      .catch(err => {
        setReviewsError(err.message);
        setReviewsLoading(false);
      });
  }, [productId]);

  // Calculate average rating and review count from reviews
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount).toFixed(1)
      : (product?.rating || 0).toFixed(1);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading product...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-6">Sorry, we couldn't find the product you're looking for.</p>
            <Link to="/">
              <Button className="bg-red-500 hover:bg-red-600">Return to Home</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || 'Check out this product!',
          text: product?.description || 'I found this amazing product!',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          toast({
            title: "Link copied!",
            description: "Product link copied to clipboard.",
            duration: 3000,
          });
        })
        .catch(err => {
          console.error('Failed to copy:', err);
          toast({
            title: "Couldn't copy link",
            description: "Please copy the URL manually.",
            variant: "destructive",
            duration: 3000,
          });
        });
    }
  };

  const display = hasVariants && selectedVariant ? selectedVariant : product;

  const handleAddToCart = () => {
    if (!display) return;
    dispatch(addToCart({
      ...display,
      id: display.id?.toString() || product.id?.toString(),
      productId: typeof display.id === 'string' ? parseInt(display.id, 10) : display.id || product.id,
      name: (display as any).name || product.name,
      price: display.price,
      image: (display as any).image || (display.images ? display.images[0] : product.image),
      quantity: 1,
    }));
    toast({
      title: 'Added to Cart',
      description: `${(display as any).name || product.name} has been added to your cart.`
    });
  };

  const handleAddToWishlist = () => {
    if (!display) return;
    dispatch(addToWishlist({
      ...display,
      id: display.id?.toString() || product.id?.toString(),
      name: (display as any).name || product.name,
      price: display.price,
      image: (display as any).image || (display.images ? display.images[0] : product.image),
      inStock: display.inventory > 0,
    }));
    toast({
      title: 'Added to Wishlist',
      description: `${(display as any).name || product.name} has been added to your wishlist.`
    });
  };

  // Only show main image first, then additional images that are not the main image
  const images = [
    product.image,
    ...(product.images || []).filter(img => img && img !== product.image)
  ].filter(Boolean);

console.log("lund "+images.length)
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <div className="mb-6 text-sm">
            <Link to="/" className="text-gray-500 hover:text-red-500">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to={`/category/${product?.category?.toLowerCase()}`} className="text-gray-500 hover:text-red-500">{product?.category}</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700">{product?.name}</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            {/* Product Gallery */}
            <div className="md:w-2/5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
              <ProductGallery 
                productName={product.name}
                mainImage={images[0]}
                images={images}
                video={product.video}
              />
              </motion.div>
            </div>
            
            {/* Product Details */}
            <div className="md:w-3/5">
              <div className="mb-2">
                <Link to={`/category/${product?.category?.toLowerCase()}`} className="text-sm text-gray-500 hover:text-red-500">
                  {product?.category}
                </Link>
              </div>
              
              <h1 className="text-2xl font-bold mb-4">{product?.name}</h1>
              
              {/* Variant selectors */}
              {hasVariants && (
                <div className="mb-6 space-y-3">
                  {/* Color selector */}
                  <div className="flex items-center">
                    <span className="w-24 text-gray-600">Color:</span>
                    <select
                      className="font-medium border rounded px-2 py-1 ml-2"
                      value={selectedVariant.color}
                      onChange={e => {
                        const color = e.target.value;
                        // Find first variant with this color
                        const v = product.variants.find((v: any) => v.color === color);
                        setSelectedVariantId(v.id);
                      }}
                    >
                      {getUnique(product.variants, 'color').map((color: string) => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                  {/* Size selector */}
                  {getUnique(product.variants, 'size').length > 1 && (
                    <div className="flex items-center">
                      <span className="w-24 text-gray-600">Size:</span>
                      <select
                        className="font-medium border rounded px-2 py-1 ml-2"
                        value={selectedVariant.size}
                        onChange={e => {
                          const size = e.target.value;
                          // Find first variant with this size and current color
                          const v = product.variants.find((v: any) => v.size === size && v.color === selectedVariant.color);
                          setSelectedVariantId(v ? v.id : selectedVariant.id);
                        }}
                      >
                        {getUnique(product.variants.filter((v: any) => v.color === selectedVariant.color), 'size').map((size: string) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {/* Material selector */}
                  {getUnique(product.variants, 'material').length > 1 && (
                    <div className="flex items-center">
                      <span className="w-24 text-gray-600">Material:</span>
                      <select
                        className="font-medium border rounded px-2 py-1 ml-2"
                        value={selectedVariant.material}
                        onChange={e => {
                          const material = e.target.value;
                          // Find first variant with this material, color, and size
                          const v = product.variants.find((v: any) => v.material === material && v.color === selectedVariant.color && v.size === selectedVariant.size);
                          setSelectedVariantId(v ? v.id : selectedVariant.id);
                        }}
                      >
                        {getUnique(product.variants.filter((v: any) => v.color === selectedVariant.color && v.size === selectedVariant.size), 'material').map((material: string) => (
                          <option key={material} value={material}>{material}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {/* Finish selector */}
                  {getUnique(product.variants, 'finish').length > 1 && (
                    <div className="flex items-center">
                      <span className="w-24 text-gray-600">Finish:</span>
                      <select
                        className="font-medium border rounded px-2 py-1 ml-2"
                        value={selectedVariant.finish}
                        onChange={e => {
                          const finish = e.target.value;
                          // Find first variant with this finish, color, size, material
                          const v = product.variants.find((v: any) => v.finish === finish && v.color === selectedVariant.color && v.size === selectedVariant.size && v.material === selectedVariant.material);
                          setSelectedVariantId(v ? v.id : selectedVariant.id);
                        }}
                      >
                        {getUnique(product.variants.filter((v: any) => v.color === selectedVariant.color && v.size === selectedVariant.size && v.material === selectedVariant.material), 'finish').map((finish: string) => (
                          <option key={finish} value={finish}>{finish}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <Star
                      size={18}
                      fill={i < Math.floor(product?.rating || 0) ? "#FFC107" : "none"}
                      stroke={i < Math.floor(product?.rating || 0) ? "#FFC107" : "#D1D5DB"}
                      className={i < Math.floor(product?.rating || 0) ? "text-yellow-400" : "text-gray-300"}
                    />
                    </motion.div>
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">{product?.rating} ({product?.reviewCount} reviews)</span>
              </div>
              
              {/* Price Section */}
              <div className="mb-6">
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-red-500">£{display.price.toFixed(2)}</span>
                  {display.oldPrice && (
                    <span className="ml-3 text-lg text-gray-500 line-through">£{display.oldPrice.toFixed(2)}</span>
                  )}
                  {display.oldPrice && (
                    <span className="ml-3 text-sm bg-red-500 text-white px-2 py-1 rounded">
                      Save £{(display.oldPrice - display.price).toFixed(2)}
                    </span>
                  )}
                </div>
                
                {/* Availability status */}
                <div className="mt-2">
                  {display.inventory === 0 ? (
                    <span className="text-red-500 font-medium">Out of Stock</span>
                  ) : (
                    <span className="text-green-600 font-medium">In Stock</span>
                  )}
                </div>
              </div>
              
              {/* Short description */}
              {/* <div className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: display.description }} /> */}
              
              {/* Color and Material */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center">
                  <span className="w-24 text-gray-600">Color:</span>
                  <span className="font-medium">{product?.color}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 text-gray-600">Material:</span>
                  <span className="font-medium">{product?.material}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                <Button 
                  className="w-full py-6 text-lg bg-red-500 hover:bg-red-600"
                  onClick={handleAddToCart}
                  disabled={display.inventory === 0}
                >
                  Add to Basket
                </Button>
                </motion.div>
                
                <div className="flex mt-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 mr-2"
                    onClick={handleAddToWishlist}
                  >
                    <Heart size={18} className="mr-1" /> Wishlist
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleShare}
                  >
                    <Share2 size={18} className="mr-1" /> Share
                  </Button>
                </div>
              </div>
              
              {/* Product Benefits */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                  <Truck size={20} className="mr-2 text-gray-600 mt-1" />
                  </motion.div>
                  <div>
                    <p className="font-medium">Free UK Delivery</p>
                    <p className="text-sm text-gray-500">Orders over £75</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                  <Shield size={20} className="mr-2 text-gray-600 mt-1" />
                  </motion.div>
                  <div>
                    <p className="font-medium">1 Year Warranty</p>
                    <p className="text-sm text-gray-500">On all products</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                  <RotateCcw size={20} className="mr-2 text-gray-600 mt-1" />
                  </motion.div>
                  <div>
                    <p className="font-medium">30-Day Returns</p>
                    <p className="text-sm text-gray-500">Hassle-free returns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description and Specifications side by side (or stacked on mobile) */}
          <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 flex flex-col gap-4"
            >
              <h3 className="text-2xl font-bold mb-2 text-gray-900 flex items-center gap-2">
                <Info className="w-6 h-6 text-blue-500" /> Product Description
              </h3>
              <div className="text-lg text-gray-700 mb-2" dangerouslySetInnerHTML={{ __html: product.description }} />
              <ul className="space-y-3 mt-4">
                <li className="text-base text-gray-800">Premium {product.material} construction for durability</li>
                <li className="text-base text-gray-800">Elegant {product.color} finish for modern style</li>
                <li className="text-base text-gray-800">Designed for comfort and functionality</li>
                <li className="text-base text-gray-800">1-Year warranty & 30-day returns</li>
              </ul>
            </motion.div>
            {/* Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8"
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                <Info className="w-6 h-6 text-blue-500" /> Product Specifications
              </h3>
              <dl className="divide-y divide-gray-200">
                <div className="flex items-center py-3">
                  <dt className="w-1/3 flex items-center gap-2 text-gray-600 font-medium">
                    <Tag className="w-5 h-5 text-gray-400" /> Brand
                  </dt>
                  <dd className="w-2/3 text-gray-900 font-bold">{(selectedVariant?.brand || product.brand) ?? "N/A"}</dd>
                </div>
                <div className="flex items-center py-3">
                  <dt className="w-1/3 flex items-center gap-2 text-gray-600 font-medium">
                    <User className="w-5 h-5 text-gray-400" /> Model
                  </dt>
                  <dd className="w-2/3 text-gray-900">{(selectedVariant?.productModel || product.productModel) ?? `HIR-${product.id}00`}</dd>
                </div>
                <div className="flex items-center py-3">
                  <dt className="w-1/3 flex items-center gap-2 text-gray-600 font-medium">
                    <Palette className="w-5 h-5 text-gray-400" /> Color
                  </dt>
                  <dd className="w-2/3 text-gray-900 font-semibold">{product.color}</dd>
                </div>
                <div className="flex items-center py-3">
                  <dt className="w-1/3 flex items-center gap-2 text-gray-600 font-medium">
                    <Layers className="w-5 h-5 text-gray-400" /> Material
                  </dt>
                  <dd className="w-2/3 text-gray-900 font-semibold">{product.material}</dd>
                </div>
                <div className="flex items-center py-3">
                  <dt className="w-1/3 flex items-center gap-2 text-gray-600 font-medium">
                    <Tag className="w-5 h-5 text-gray-400" /> Category
                  </dt>
                  <dd className="w-2/3 text-gray-900">{product.category}</dd>
                </div>
                {product.dimensions && (
                  <div className="flex items-center py-3">
                    <dt className="w-1/3 flex items-center gap-2 text-gray-600 font-medium">
                      <Sofa className="w-5 h-5 text-gray-400" /> Dimensions
                    </dt>
                    <dd className="w-2/3 text-gray-900">
                      {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                    </dd>
                  </div>
                )}
                {product.weight && (
                  <div className="flex items-center py-3">
                    <dt className="w-1/3 flex items-center gap-2 text-gray-600 font-medium">
                      <Sofa className="w-5 h-5 text-gray-400" /> Weight
                    </dt>
                    <dd className="w-2/3 text-gray-900">
                      {product.weight} kg
                    </dd>
                  </div>
                )}
              </dl>
              {product?.details && (
                <div className="mt-6">
                  <h4 className="font-medium text-lg mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-500" /> Product Details
                  </h4>
                  <ul className="space-y-2">
                    {product.details.map((detail, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span dangerouslySetInnerHTML={{ __html: detail }} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>

          {/* A+ Content Section (Amazon-style Enhanced Content) */}
          {product.aPlusImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="relative w-full max-w-[1400px] mx-auto px-4 mb-8">
                <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-2xl">
                  <img
                    src={product.aPlusImage}
                    alt="A+ Banner"
                    className="w-full h-full object-contain object-center transition-transform duration-300"
                  />
                </div>
              </div>
            </motion.div>
          )}


            {/* Feature Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div whileHover={{ y: -6, scale: 1.04 }} className="bg-gradient-to-br from-pink-50 via-yellow-50 to-white rounded-xl shadow p-6 flex flex-col items-center text-center">
                <Shield className="w-10 h-10 text-blue-500 mb-3" />
                <h4 className="font-bold mb-1">Built to Last</h4>
                <p className="text-gray-600 text-sm">Engineered for durability and everyday use.</p>
              </motion.div>
              <motion.div whileHover={{ y: -6, scale: 1.04 }} className="bg-gradient-to-br from-pink-50 via-yellow-50 to-white rounded-xl shadow p-6 flex flex-col items-center text-center">
                <Sparkles className="w-10 h-10 text-pink-500 mb-3" />
                <h4 className="font-bold mb-1">Modern Design</h4>
                <p className="text-gray-600 text-sm">Sleek, contemporary style for any space.</p>
              </motion.div>
              <motion.div whileHover={{ y: -6, scale: 1.04 }} className="bg-gradient-to-br from-pink-50 via-yellow-50 to-white rounded-xl shadow p-6 flex flex-col items-center text-center">
                <RotateCcw className="w-10 h-10 text-yellow-500 mb-3" />
                <h4 className="font-bold mb-1">Easy Returns</h4>
                <p className="text-gray-600 text-sm">30-day hassle-free returns on all products.</p>
              </motion.div>
            </div>

            {/* Infographic Strip */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
              <div className="flex flex-col items-center">
                <Truck className="w-8 h-8 text-green-500 mb-1" />
                <span className="font-medium text-gray-700">Free UK Delivery Above £75</span>
              </div>
              <div className="flex flex-col items-center">
                <Shield className="w-8 h-8 text-blue-500 mb-1" />
                <span className="font-medium text-gray-700">One Year Warranty</span>
              </div>
              <div className="flex flex-col items-center">
                <Palette className="w-8 h-8 text-purple-500 mb-1" />
                <span className="font-medium text-gray-700">Multiple Colors</span>
              </div>
            </div>
            
            {/* Brand Story / Trust Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-pink-50 via-white to-blue-50 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center"
            >
              <Info className="w-10 h-10 text-blue-500 mb-3" />
              <h4 className="text-xl font-bold mb-2">Why Choose Hirix?</h4>
              <p className="text-gray-700 max-w-2xl mx-auto">
                At Hirix, we are committed to delivering premium quality, modern design, and exceptional customer service. Our products are crafted with care and backed by a 1-year warranty and hassle-free returns. Shop with confidence and elevate your space with Hirix.
              </p>
            </motion.div>
          
          
          {/* Reviews Section (moved below A+ Content) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
            {user && (
              <Button className="mb-4 bg-red-500 hover:bg-red-600 text-white" onClick={() => { console.log('Open review dialog'); setReviewDialogOpen(true); }}>
                Write a Review
              </Button>
            )}
            {reviewsLoading ? (
              <div className="text-gray-500">Loading reviews...</div>
            ) : reviewsError ? (
              <div className="text-red-500">{reviewsError}</div>
            ) : (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="text-center p-6 border rounded-lg bg-white mb-4">
                    <div className="text-4xl font-bold mb-2">{averageRating}</div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                          <Star
                            size={18}
                            fill={i < Math.round(averageRating) ? "#FFC107" : "none"}
                            stroke={i < Math.round(averageRating) ? "#FFC107" : "#D1D5DB"}
                          />
                        </motion.div>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">Based on {reviewCount} review{reviewCount !== 1 ? 's' : ''}</div>
                    {/* Star breakdown (optional, can be implemented later) */}
                  </div>
                </div>
                <div className="md:w-2/3">
                  {reviewCount === 0 ? (
                    <div className="text-gray-500">No reviews yet. Be the first to review this product!</div>
                  ) : (
                    <Accordion type="single" collapsible className="w-full">
                      {reviews.map((review, idx) => (
                        <AccordionItem value={`review-${idx}`} key={review._id || idx}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-center gap-3">
                              {/* Placeholder avatar, can be replaced with user info if available */}
                              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=User${idx+1}`} alt="User" className="w-8 h-8 rounded-full" />
                              <div>
                                <div className="flex items-center">
                                  <div className="flex mr-2">
                                    {[...Array(5)].map((_, i) => (
                                      <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                      >
                                        <Star
                                          size={14}
                                          fill={i < review.rating ? "#FFC107" : "none"}
                                          stroke={i < review.rating ? "#FFC107" : "#D1D5DB"}
                                        />
                                      </motion.div>
                                    ))}
                                  </div>
                                  <span className="font-medium">{review.comment?.slice(0, 30) || 'Review'}</span>
                                </div>
                                {/* Optionally show user name and date if available */}
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-gray-700">{review.comment}</p>
                            {/* Optionally show review images if available */}
                            {review.images && review.images.length > 0 && (
                              <div className="flex gap-2 mt-2">
                                {review.images.map((img, i) => (
                                  <img key={i} src={img} alt={`Review image ${i+1}`} className="w-16 h-16 object-cover rounded" />
                                ))}
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Related Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h3 className="text-xl font-semibold mb-6">You May Also Like</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allProducts
                .filter(p => p.category === product.category && p.id !== product.id)
                .slice(0, 4)
                .map(relatedProduct => (
                  <motion.div
                    key={relatedProduct.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover transform transition-transform hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <Link to={`/product/${relatedProduct.id}`} className="hover:text-red-500">
                        <h4 className="font-medium line-clamp-2">{relatedProduct.name}</h4>
                      </Link>
                      <div className="flex items-center mt-2 mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                              >
                                <Star
                              size={14}
                              fill={i < Math.floor(relatedProduct?.rating || 0) ? "#FFC107" : "none"}
                              stroke={i < Math.floor(relatedProduct?.rating || 0) ? "#FFC107" : "#D1D5DB"}
                            />
                              </motion.div>
                            </motion.div>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">({relatedProduct.reviewCount})</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <span className="font-bold text-red-500">£{relatedProduct.price.toFixed(2)}</span>
                          {relatedProduct.oldPrice && (
                            <span className="text-xs text-gray-500 line-through ml-2">
                              £{relatedProduct.oldPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer/>
      <ReviewDialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        productId={product._id || product.id}
        userId={user?.id}
        onReviewSubmitted={() => {
          setReviewDialogOpen(false);
          setReviewsLoading(true);
          setReviewsError(null);
          fetch(`/api/reviews?productId=${product._id || product.id}`)
            .then(res => {
              if (!res.ok) throw new Error('Failed to fetch reviews');
              return res.json();
            })
            .then(data => {
              setReviews(data);
              setReviewsLoading(false);
            })
            .catch(err => {
              setReviewsError(err.message);
              setReviewsLoading(false);
            });
        }}
      />
    </div>
  );
};

export default ProductPage;