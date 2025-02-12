/* eslint-disable */
import { showAlert } from './alerts';
import axios from 'axios';

export const signUp = async (name, email, password, passwordConfirm) => {
  try {
    const result = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    });

    if (result.data.status === 'success') {
      showAlert('success', 'Signed Up Successfully!');
      window.setTimeout(() => {
        location.assign('/'); // Redirect after successful signup
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
