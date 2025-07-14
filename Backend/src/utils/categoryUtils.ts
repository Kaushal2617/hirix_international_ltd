export const formatCategoryName = (name: string) => {
  return name.trim().replace(/\s+/g, ' ');
};

export const generateCategorySlug = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, '-');
}; 