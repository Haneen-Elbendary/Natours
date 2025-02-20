
![127 0 0 1_3000_](https://github.com/user-attachments/assets/bdcfd139-a063-4f67-82ed-f74941282cda)

---

# **Natours**

A highly scalable and secure RESTful API for a tour booking platform, built with **Node.js**, **Express.js**, and **MongoDB**. This project follows the **MVC** architecture and includes authentication, authorization, secure data handling, and **Stripe** integration for payments.

## 🚀 **Features**

- **Authentication & Authorization:** Secure user authentication using JWT.
- **Role-based Access Control:** Restrict access to certain routes based on user roles (admin, user, guide, etc.).
- **Tour Management:** CRUD operations for tours with filtering, sorting, and pagination.
- **User Management:** Signup, login, password reset, profile updates.
- **Reviews & Ratings:** Users can add, update, and delete reviews.
- **Booking System:** Secure online payment integration using Stripe.
- **Security Enhancements:** Helmet, CORS, XSS protection, NoSQL injection prevention.
- **Rate Limiting & Data Compression:** Improve API performance and security.
- **Error Handling:** Centralized error handling using custom error classes.
- **Template Rendering:** Pug template engine for rendering web pages.

## 🛠 **Tech Stack**

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JSON Web Tokens (JWT), bcrypt
- **Security:** Helmet, express-rate-limit, express-mongo-sanitize, xss-clean
- **Payment Processing:** Stripe API
- **Views:** Pug template engine
- **Deployment:** Environment variables management with `dotenv`
Here's how you can structure and enhance the **Screenshots** section in your README file to make it look polished and professional. You can include the full-size screenshots you took for the different pages and describe each of them:

---

## 📸 Screenshots
### **Login Page**
![127 0 0 1_3000_login](https://github.com/user-attachments/assets/20d3aa2e-3bea-46fe-ba90-d095521385d4)

The login page where users can securely authenticate with their credentials to access their account.

---

### **Signup Page**

![127 0 0 1_3000_signup](https://github.com/user-attachments/assets/74008c25-3658-47b5-8266-59a961070760)


The signup page that allows users to create a new account by providing necessary information like email, username, and password.

---

###  **Verify Email**

![verify-email-code](https://github.com/user-attachments/assets/2d669dce-f9d1-4328-9f56-da05ce5ee570)

The Verify Email page, where users confirm their email address by entering the verification code sent to their inbox.

---
### Email Page  

![Email](https://github.com/user-attachments/assets/0ec8139d-8137-45e9-aab8-68a63b23190b)


The Email page, where users receive important account-related emails, such as verification codes and password reset links.  


---

### **Me: User Info**

![127 0 0 1_3000_me](https://github.com/user-attachments/assets/ce3b7750-9344-409a-9f52-b40aa3a71e2b)

The user profile page, where users can view and update their personal details, such as name, email, and profile picture.

---

### **Tour Details Page**

![127 0 0 1_3000_tour_The-Forest-Hiker](https://github.com/user-attachments/assets/ae84d510-183b-412e-afac-dc6f28c5b76c)

Detailed view of a specific tour, including descriptions, images, and other important information to help users make an informed decision.

---

### **Checkout Page**

![checkout stripe com_c_pay_cs_test_a16D14ZtFDjKajWEun5wsu5KgvpeDIVBmu5Ff1BC1xftFmppYFaUQpMte4](https://github.com/user-attachments/assets/bad7c4f4-fc7d-4733-b01a-8c1cd968a0ad)

The secure checkout page where users can finalize their booking by providing payment details and reviewing their selections.

---

### **My Booked Tours**


![127 0 0 1_3000_my-tours](https://github.com/user-attachments/assets/6dd15330-e20d-4cd0-861f-98e7efa7f16e)

A dedicated page for users to see their past and upcoming tours, with options to view details or cancel bookings.

---


## 📂 **Project Structure**

```
├── controllers/          # Business logic for different entities
├── models/               # Mongoose schemas and models
├── routes/               # Route definitions and API endpoints
├── public/               # Static files (CSS, JS, images)
├── views/                # Pug templates for server-side rendering
├── utils/                # Utility functions and error handling
├── config.env            # Environment variables
├── server.js             # Main server entry point
├── app.js                # Express app configuration
```

## 🔧 **Installation & Setup**

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Haneen-Elbendary/Natours
   cd Natours
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Create a `.env` file in the root directory and configure:**
   ```
   NODE_ENV=development
   DATABASE=mongodb+srv://<username>:<password>@cluster.mongodb.net/natours
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=90d
   JWT_COOKIE_EXPIRES_IN=90
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. **Start the development server:**
   ```sh
   npm run dev
   ```

5. The API documentation is available at [Postman Documentation](https://documenter.getpostman.com/view/37206250/2sAYQgfngE)

Now, it directs users to your Postman API documentation link! Let me know if you'd like to make further adjustments.

## 📌 **API Endpoints**

### **Authentication**
- `POST /api/v1/users/signup` – Register a new user
- `POST /api/v1/users/login` – User login
- `POST /api/v1/users/forgotPassword` – Password reset request
- `PATCH /api/v1/users/resetPassword/:token` – Reset password
- `PATCH /api/v1/users/updatePassword` – Update user password

### **Tours**
- `GET /api/v1/tours` – Get all tours
- `GET /api/v1/tours/stats` – Get tours statistics
- `GET /api/v1/tours/monthly-plan` – Get monthly tour plan
- `GET /api/v1/tours/:id` – Get a single tour
- `GET /api/v1/tours/top-5-cheap` – Get the top 5 cheapest tours
- `POST /api/v1/tours` – Create a new tour (admin only)
- `DELETE /api/v1/tours/:id` – Delete a tour (admin only)
- `PATCH /api/v1/tours/:id` – Update a tour (admin only)
- `GET /api/v1/tours/within-radius` – Get tours within a radius from a point
- `GET /api/v1/tours/distances` – Get distances for all tours from a point

### **Users**
- `GET /api/v1/users` – Get all users (admin only)
- `GET /api/v1/users/:id` – Get a single user (admin only)
- `GET /api/v1/users/me` – Get the current logged-in user
- `POST /api/v1/users` – Create a new user (admin only)
- `PATCH /api/v1/users/:id` – Update user (admin only)
- `PATCH /api/v1/users/me` – Update current user data
- `DELETE /api/v1/users/:id` – Delete a user (admin only)
- `DELETE /api/v1/users/me` – Delete current user account

### **Reviews**
- `GET /api/v1/reviews` – Get all reviews (admin only)
- `GET /api/v1/reviews/:id` – Get a single review (admin only)
- `POST /api/v1/tours/:tourId/reviews` – Create a review on a tour (user)
- `PATCH /api/v1/reviews/:id` – Update a review (user)
- `DELETE /api/v1/reviews/:id` – Delete a review (user)
- `GET /api/v1/tours/:tourId/reviews` – Get all reviews on a tour

### **Bookings**
- `GET /api/v1/bookings` – Get all bookings (admin only)
- `GET /api/v1/bookings/:id` – Get a booking (admin only)
- `POST /api/v1/bookings` – Create a booking (user)
- `PATCH /api/v1/bookings/:id` – Update a booking (user)
- `DELETE /api/v1/bookings/:id` – Delete a booking (user)

## 🔒 **Security Measures**

- **CORS Handling**: Configured to allow only specific origins.
- **Rate Limiting**: Restricts API requests to prevent abuse.
- **Data Sanitization**: Prevents NoSQL injection and XSS attacks.
- **Secure HTTP Headers**: Implemented using Helmet.
- **User Authentication**: Secure password hashing and JWT-based authentication.
To add a section about future improvements and features, you can include something like this:

---


### 🚀 Future Improvements  
This project is continuously evolving, and I plan to enhance its functionality with several new features, including:  

- **Sign-Up Form**: I will implement a sign-up form similar to the login form.  
- **Tour Reviews**: On the tour detail page, users who have taken a tour will be able to add a review directly on the website via a dedicated form.  
- **Booking Restrictions**: The booking section on the tour detail page will be hidden if the current user has already booked the tour, preventing duplicate bookings at the model level.  
- **Like & Favorite Tours**: I will add a "like tour" functionality, allowing users to save their favorite tours to a dedicated page.  
- **My Reviews Page**: On the user account page, I will implement a "My Reviews" section where users can view and edit their submitted reviews.  
- **Admin Management**: I will create full "Manage" pages for administrators to **CRUD** (Create, Read, Update, Delete) tours, users, reviews, and bookings.  

Stay tuned for these exciting updates! 🚀
---

## 🚀 **Deployment**

### **Deploy to Production**

1. Set up a cloud database (MongoDB Atlas recommended).
2. Configure production `.env` variables.
3. Use a process manager like PM2:
   ```sh
   pm2 start server.js --name Natours
   ```
4. Reverse proxy with Nginx or deploy to a platform like Heroku.

## 🤝 **Contributing**

Contributions are welcome! If you’d like to improve this project, please fork the repository and submit a pull request.

---

## 📄 **Copyright**

© 2025 Haneen Elbendary. All rights reserved.

---

---

### ⭐ **Show your support**
If you like this project, give it a ⭐ on GitHub!

---

**Author:** Haneen Elbendary

---

