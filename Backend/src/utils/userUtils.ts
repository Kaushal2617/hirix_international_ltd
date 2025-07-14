export const formatUserName = (name: string) => {
  return name.trim().replace(/\s+/g, ' ');
};

export const isValidPhone = (phone: string) => {
  // Simple phone validation (customize as needed)
  return /^\+?\d{10,15}$/.test(phone);
}; 