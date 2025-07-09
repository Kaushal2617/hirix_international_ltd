export interface Banner {
  id: string;
  imageUrl: string;        // Desktop
  mobileImageUrl?: string; // Mobile (optional)
  type: 'hero' | 'mini';
  category?: string; // for hero banners
  link?: string;     // for mini banners
  title?: string;
}

export const banners: Banner[] = [
  {
    id: 'demo-hero-1',
    imageUrl: '/images/banner1.jpeg',
    mobileImageUrl: '/images/banner1.jpeg',
    type: 'hero',
    category: 'Living Room',
    title: 'Shop Now',
  },
  {
    id: 'demo-hero-2',
    imageUrl: '/images/banner2.jpeg',
    mobileImageUrl: '/images/banner2.jpeg',
    type: 'hero',
    category: 'Bedroom',
    title: 'Explore',
  },
  {
    id: 'demo-hero-3',
    imageUrl: '/images/banner3.jpeg',
    mobileImageUrl: '/images/banner3.jpeg',
    type: 'hero',
    category: 'Kids',
    title: 'Buy Now',
  },
]; 