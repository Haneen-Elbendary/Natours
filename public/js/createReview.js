/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// Function to create a review
export const createReview = async (review, rating, user, tour) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/reviews',
      data: {
        review,
        rating,
        user,
        tour
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'The review was added successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  } catch (err) {
    if (err.response.data.message.includes('index: tour_1_user_1'))
      showAlert('error', 'You can create 1 review only for each booked tour!');
    else
      showAlert('error', err.response.data.message || 'Something went wrong');
  }
};
