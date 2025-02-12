const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { type } = require('os');
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name'],
      trim: true,
      maxlength: [40, 'A User name must have less or equal then 40 characters'],
      minlength: [10, 'A User name must have more or equal then 10 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      trim: true,
      lowercase: true,
      // there is in the docs of validator package
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
      type: String,
      default: 'default.jpg'
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'guide', 'lead-guide'],
      default: 'user'
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false // to make it not visible in get user/s data requests
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator:
          // to validate the 2 passwords are the same
          function(el) {
            return el === this.password;
          },
        message: 'Passwords are not the same!'
      }
    },
    passwordChangedAt: Date,
    passwordRestToken: String,
    passwordRestExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    }
    // {
    //   type: Date,
    //   set: function(value) {
    //     // Regular expression to match YY-DD-MM
    //     const regex = /^\d{2}-\d{2}-\d{2}$/;
    //     if (!regex.test(value)) {
    //       throw new Error('Please Enter Valid Date Format YY-DD-MM');
    //     }

    //     // Parse the input date
    //     const [year, day, month] = value.split('-').map(Number);

    //     // Convert `YY` to a full year (assuming 20th century if YY < 70)
    //     const fullYear = year < 70 ? 2000 + year : 1900 + year;

    //     // Return a Date object
    //     return new Date(fullYear, month - 1, day);
    //   }
    // }
  },
  { timestamps: true }
);
// start comment
userSchema.pre('save', async function(next) {
  // this fuction will be excuted if the password field get modified
  if (!this.isModified('password')) {
    return next();
  }
  //   hash the password with cost 12
  this.password = await bcrypt.hash(this.password, 12);
  //   delete passwordConfirm field -> not needed here
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre(/^find/, function(next) {
  // /^find/ : look for string that start with find
  // this point to the current query
  this.find({ active: { $ne: false } });
  next();
});
// end comment
// create instanceMethod to make it available for the entire User collection
userSchema.methods.correctPassword = async (
  candidatePassword,
  userPassword
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.passwordChangedAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    // eslint-disable-next-line radix
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return changedTimestamp > JWTTimestamp;
  }
  // false means -> does'nt changed
  return false;
};
userSchema.methods.createPasswordRestToken = function() {
  // generate token base16
  const resetToken = crypto.randomBytes(32).toString('hex');
  // encrypt it and assign it to its property
  this.passwordRestToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  // console.log({ resetToken }, this.passwordRestToken);
  // assign value to passwordRestExpire -> 10 mins before expiration
  this.passwordRestExpires = Date.now() + 10 * 60 * 1000;

  // return the plan restToken
  return resetToken;
};
// we must create all needed methods first then create the model
// create the user model
const User = mongoose.model('User', userSchema);
module.exports = User;
