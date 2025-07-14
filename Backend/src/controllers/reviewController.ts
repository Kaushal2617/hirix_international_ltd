import { Request, Response } from 'express';
import { Review } from '../models/Review';

export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

export const getReviewById = async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch review' });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create review', details: err });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update review', details: err });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

export const deleteAllReviews = async (req: Request, res: Response) => {
  try {
    await Review.deleteMany({});
    res.json({ message: 'All reviews deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete all reviews' });
  }
}; 