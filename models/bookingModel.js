const mongoose = require('mongoose');
const Tour = require('./tourModel');
const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour!']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!']
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price.']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  //   maybe needed if the client doesn't have credit card and want to pay cash in the store through the admin.
  paid: {
    type: Boolean,
    default: true
  }
});
// we will populate user and tour
// this will not affect on the perforamnce bcz bookings will be requested only by the admin and the tour guide
bookingSchema.pre(/^find/, function(next) {
  // this refer to the current model
  this.populate('user').populate({
    path: 'tour',
    select: 'name'
  });
  next();
});
//Create a unique index to prevent duplicate bookings
bookingSchema.index({ tour: 1, user: 1 }, { unique: true });
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
