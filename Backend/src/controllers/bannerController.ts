import { Request, Response } from 'express';
import { Banner } from '../models/Banner';

export const getAllBanners = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    let query = {};
    if (type) {
      query = { type };
    }
    const banners = await Banner.find(query);
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
};

export const getBannerById = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ error: 'Banner not found' });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch banner' });
  }
};

export const createBanner = async (req: Request, res: Response) => {
  try {
    const banner = new Banner(req.body);
    await banner.save();
    res.status(201).json(banner);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create banner', details: err });
  }
};

export const updateBanner = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return res.status(404).json({ error: 'Banner not found' });
    res.json(banner);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update banner', details: err });
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ error: 'Banner not found' });
    res.json({ message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete banner' });
  }
};

export const deleteAllBanners = async (req: Request, res: Response) => {
  try {
    await Banner.deleteMany({});
    res.json({ message: 'All banners deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete all banners' });
  }
}; 