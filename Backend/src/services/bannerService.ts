import { Banner } from '../models/Banner';

export const findAllBanners = async () => {
  return Banner.find();
};

export const findBannerById = async (id: string) => {
  return Banner.findById(id);
};

export const createBanner = async (data: any) => {
  const banner = new Banner(data);
  return banner.save();
};

export const updateBanner = async (id: string, data: any) => {
  return Banner.findByIdAndUpdate(id, data, { new: true });
};

export const deleteBanner = async (id: string) => {
  return Banner.findByIdAndDelete(id);
}; 