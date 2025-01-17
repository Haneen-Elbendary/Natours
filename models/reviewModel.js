const mongoose = require('mongoose');

const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    //   parent referencing -> bcz we may have tons of reviews related to a specific user || a tour
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user.']
      }
    ],
    tour: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour.']
      }
    ]
  },
  {
    // to ensure that 'virtual fields exist in the output either json || obj -> virtual fields : not exist in the DB but exist in the json || obj  output
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
// populate the reviews
reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name photo'
  // }).populate({
  //   path: 'tour',
  //   select: 'name'
  // });
  // No need for tour data on the review it's a lot unwanted data -> user data is enough
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

reviewSchema.statics.calcAverageRating = async function(tourId) {
  // this -> refers to the current model
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  // save it to the tour
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating
  });
};
reviewSchema.post('save', function() {
  // this.constructor -> = Review , this -> the current doc
  this.constructor.calcAverageRating(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
