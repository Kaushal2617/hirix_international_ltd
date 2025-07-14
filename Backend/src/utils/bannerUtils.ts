export const formatBannerTitle = (title?: string) => {
  return title ? title.trim() : 'Untitled Banner';
};

export const isHeroBanner = (type: string) => {
  return type === 'hero';
}; 