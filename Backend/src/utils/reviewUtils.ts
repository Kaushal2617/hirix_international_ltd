export const isPositiveRating = (rating: number) => {
  return rating >= 4;
};

export const formatReviewComment = (comment: string) => {
  return comment.trim();
}; 