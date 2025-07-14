import { Review } from '../models/Review';

export const findAllReviews = async () => {
  return Review.find();
};

export const findReviewById = async (id: string) => {
  return Review.findById(id);
};

export const createReview = async (data: any) => {
  const review = new Review(data);
  return review.save();
};

export const updateReview = async (id: string, data: any) => {
  return Review.findByIdAndUpdate(id, data, { new: true });
};

export const deleteReview = async (id: string) => {
  return Review.findByIdAndDelete(id);
}; 