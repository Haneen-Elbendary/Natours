/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { signUp } from './signup';
import { verifyEmail } from './verifyEmail';
import { showMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { createReview } from './createReview';
import { showAlert } from './alerts';
// DOM element
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const formUserData = document.querySelector('.form-user-data');
const formUserPassword = document.querySelector('.form-user-password');
const btnPassword = document.querySelector('.btn-password');
const bookBtn = document.getElementById('book-tour');
const signupForm = document.querySelector('.form--signUp');
const verifyForm = document.querySelector('.form--verify');
const reviewForm = document.querySelector('.review-form');
const submitReviewBtn = document.querySelector('#submitReview');
// Values
// Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  showMap(locations);
}
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    if (password !== passwordConfirm) {
      showAlert('error', 'Passwords do not match!');
      return;
    }

    signUp(name, email, password, passwordConfirm);
  });
}
if (verifyForm) {
  verifyForm.addEventListener('submit', e => {
    e.preventDefault();
    const verificationCode = document.getElementById('verificationCode').value;
    const emailVerify = document.getElementById('email-verify').value;
    verifyEmail(emailVerify, verificationCode);
  });
}

if (reviewForm) {
  reviewForm.addEventListener('submit', async e => {
    e.preventDefault();
    const rating = document.querySelector('#rating').value;
    const review = document.querySelector('#review').value;
    const user = submitReviewBtn.dataset.user;
    const tour = submitReviewBtn.dataset.tour;
    // Validate inputs
    if (!rating || !review) {
      showAlert('error', 'Please fill in all fields');
      return;
    }
    await createReview(review, rating, user, tour);
  });
}

logoutBtn.addEventListener('click', logout);
if (formUserData) {
  formUserData.addEventListener('submit', e => {
    e.preventDefault();
    // to send multipart data to the back-end
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });
}
if (formUserPassword) {
  formUserPassword.addEventListener('submit', async e => {
    e.preventDefault();
    btnPassword.innerHTML = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    btnPassword.innerHTML = 'SAVE PASSWORD';
    document.getElementById('password-current').textContent = ' ';
    document.getElementById('password').textContent = ' ';
    document.getElementById('password-confirm').textContent = ' ';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
