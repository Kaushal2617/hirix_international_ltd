export interface BannerInput {
  imageUrl: string;
  mobileImageUrl?: string;
  type: 'hero' | 'mini';
  category?: string;
  link?: string;
  title?: string;
} 