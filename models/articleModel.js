const mongoose = require("mongoose");
const slugify = require("slugify");

const articleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A article must have a name"],
      unique: true,
      trim: true,
      maxlength: [
        40,
        "A article name must have less or equal then 40 characters",
      ],
      minlength: [
        10,
        "A article name must have more or equal then 10 characters",
      ],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A article must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A article must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A article must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A article must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A article must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A article must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretArticle: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

articleSchema.index({ price: 1, ratingsAverage: -1 });
articleSchema.index({ slug: 1 });

articleSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

articleSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "article",
  localField: "_id",
});

articleSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

articleSchema.pre(/^find/, function (next) {
  this.find({ secretArticle: { $ne: true } });

  this.start = Date.now();
  next();
});

articleSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });

  next();
});

articleSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
