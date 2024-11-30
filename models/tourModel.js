const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');

// eslint-disable-next-line import/no-extraneous-dependencies
const slugify = require('slugify');
// define a schema with setting schema type options
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      // min-max length available on string only
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters']
      // use validator library
      // validate: [
      //   validator.isAlpha,
      //   'A tour name must include letters only even NO spaces'
      // ]
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      // enum is only for strings
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy ,medium ,difficult'
      }
    },
    // ratting will be later calculated from the real reviews
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // val for the inputted value
          // this will refer to the current doc only in creation of a doc only
          return val < this.price; //discountprice 100 < price 200 -> so true
        },
        // this message has access the value
        message: 'Discount price ({VALUE}) should be below the regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary']
    },
    description: {
      type: String,
      trim: true
    },
    // we will store the name of the image in the db as reference to that img and save the img itself in our file system
    // it is a common practice -> good practice
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    // createdAt will be a timestamp of when the tour created
    // automatically created timestamp
    createdAt: {
      type: Date,
      // date.now() will return a timestamp in milliseconds but mongo will convert it to today's date
      default: Date.now(),
      // this select property with exclude createdAt from the schema so we will use it internally without sending data about to the client & we it also with sensitive data like passwords
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});
// create pre and post middlewares||hooks for save event -> work on .create() & .save()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name);
  next();
});
tourSchema.post('save', function(doc, next) {
  console.log(doc);
  next();
});
// Query middleware
tourSchema.pre(/^find/, function(next) {
  this.startQuery = Date.now();
  this.find({ secretTour: { $ne: true } });
  next();
});
tourSchema.post(/^find/, function(docs, next) {
  console.log(
    `query excution time : ${Date.now() - this.startQuery} Milliseconds`
    // docs is the resulted docs of the query
  );
  next();
});
// aggregation middleware
tourSchema.pre('aggregate', function(next) {
  // we will add a stage to the pipeline array before the aggregation is excuted
  // this -> current aggregation object
  // we exclude the secretTours from the aggregation
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // console.log(this.pipeline());
  next();
});
// create a model from this schema
// mode name and model variable must start with an uppercase letter
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;