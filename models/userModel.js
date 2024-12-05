const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    photo: String,
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
    passwordChangedAt: {
      type: Date,
      set: function(value) {
        // Regular expression to match YY-DD-MM
        const regex = /^\d{2}-\d{2}-\d{2}$/;
        if (!regex.test(value)) {
          throw new Error('Please Enter Valid Date Format YY-DD-MM');
        }

        // Parse the input date
        const [year, day, month] = value.split('-').map(Number);

        // Convert `YY` to a full year (assuming 20th century if YY < 70)
        const fullYear = year < 70 ? 2000 + year : 1900 + year;

        // Return a Date object
        return new Date(fullYear, month - 1, day);
      }
    }
  },
  { timestamps: true }
);
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
// we must create all needed methods first then create the model
// create the user model
const User = mongoose.model('User', userSchema);
module.exports = User;
