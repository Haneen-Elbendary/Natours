/* eslint-disable */
import '@babel/polyfill';
import { login } from './login';
import { showMap } from './mapbox';
// DOM element
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
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
