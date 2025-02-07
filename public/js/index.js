/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { showMap } from './mapbox';
import { updateSettings } from './updateSettings';
// DOM element
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const formUserData = document.querySelector('.form-user-data');
const formUserPassword = document.querySelector('.form-user-password');
const btnPassword = document.querySelector('.btn-password');
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
logoutBtn.addEventListener('click', logout);
if (formUserData) {
  formUserData.addEventListener('submit', e => {
    e.preventDefault();
    // to send multipart data to the back-end
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);
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
