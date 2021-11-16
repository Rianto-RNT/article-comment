const mongoose = require("mongoose");
const Article = require("./articleModel");

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "comment can not be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    article: {
      type: mongoose.Schema.ObjectId,
      ref: "Article",
      required: [true, "Comment must belong to a article."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Comment must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

commentSchema.index({ article: 1, user: 1 }, { unique: true });

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

commentSchema.statics.calcAverageRatings = async function (articleId) {
  const stats = await this.aggregate([
    {
      $match: { article: articleId },
    },
    {
      $group: {
        _id: "$article",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Article.findByIdAndUpdate(articleId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Article.findByIdAndUpdate(articleId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

commentSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.article);
});

commentSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

commentSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.article);
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
