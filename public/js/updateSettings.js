/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
// type -> data || password
export const updateSettings = async (data, type) => {
  const url =
    type === 'password'
      ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
      : 'http://127.0.0.1:3000/api/v1/users/updateMe';
  try {
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
          setTimeout(() => {
            window.location.reload();
          }, 5000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
