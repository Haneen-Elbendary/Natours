/* eslint-disable */
import { showAlert } from './alerts';
import axios from 'axios';
export const login = async (email, password) => {
  try {
    const result = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    if (result.data.status === 'success') {
      showAlert('success', 'Logged In Successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
export const logout = async () => {
  try {
    const result = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });
    if (result.data.status === 'success') location.reload(true);
  } catch (err) {
    showAlert('error', 'Error Logged Out! Try again.');
  }
};
