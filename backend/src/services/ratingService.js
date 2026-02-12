import Rating from "../models/Rating.js";

export const getAverageRating = async (postId) => {
  const result = await Rating.aggregate([
    { $match: { post: postId } },
    {
      $group: {
        _id: "$post",
        average: { $avg: "$value" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (!result.length) {
    return { average: 0, count: 0 };
  }

  return {
    average: Number(result[0].average.toFixed(2)),
    count: result[0].count,
  };
};
