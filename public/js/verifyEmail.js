/* eslint-disable */
import { showAlert } from './alerts';
import axios from 'axios';

export const verifyEmail = async (email, verificationCode) => {
  try {
    const result = await axios({
      method: 'POST',
      url: '/api/v1/users/verify-email',
      data: {
        email,
        verificationCode
      }
    });

    if (result.data.status === 'success') {
      showAlert('success', 'Email Verified Successfully!');
      window.setTimeout(() => {
        location.assign('/'); // Redirect to login page after verification
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message || 'Verification failed');
  }
};
