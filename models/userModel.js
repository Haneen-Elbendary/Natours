const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
  }
});
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
// we must create all needed methods first then create the model
// create the user model
const User = mongoose.model('User', userSchema);
module.exports = User;
