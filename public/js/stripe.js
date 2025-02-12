/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
import { loadStripe } from '@stripe/stripe-js';

// const stripe = Stripe(`${process.env.STRIPE_PUBLIC_KEY}`);

export const bookTour = async tourId => {
  try {
    const stripe = await loadStripe(`${process.env.STRIPE_PUBLIC_KEY}`);
    // 1- get the checkout session from the back-end
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
 
    // 2- create checkout form + charge the credit card
    // Get the session URL
    const checkoutUrl = session.data.session.url;

    // Redirect the user to the Stripe checkout page
    window.location.href = checkoutUrl;

    // await stripe.redirectToCheckout({
    //   sessionId: session.data.session.id
    // });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
