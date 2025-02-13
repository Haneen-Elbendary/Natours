![127 0 0 1_3000_login](https://github.com/user-attachments/assets/e1da6183-642d-4941-84f7-2a6ff6098faa)
---

# **Natours API**

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

### **Overview Page**

![homeWithoutLogin](https://github.com/user-attachments/assets/f81e48e9-191f-466a-8c98-33bb0503b670)

The homepage of the Natours website, showcasing featured tours, navigation, and a clean, user-friendly interface.

---

### **Login Page**

![127 0 0 1_3000_login](https://github.com/user-attachments/assets/18b3efc5-8f51-4d4b-a86d-415d02008de6)

The login page where users can securely authenticate with their credentials to access their account.

---

### **Signup Page**

![127 0 0 1_3000_signup (2)](https://github.com/user-attachments/assets/fb320b70-6431-41eb-847c-0a283978b20f)

The signup page that allows users to create a new account by providing necessary information like email, username, and password.

---

### **Me: User Info**

![127 0 0 1_3000_me](https://github.com/user-attachments/assets/46cc84f6-9dfb-41ca-b6ad-852ad6bde6e9)

The user profile page, where users can view and update their personal details, such as name, email, and profile picture.

---

### **Tour Details Page**


Detailed view of a specific tour, including descriptions, images, and other important information to help users make an informed decision.

---

### **Checkout Page**

![checkout stripe com_c_pay_cs_test_a15BIuXXEgzh3Eu935AYkXpRG4XmX6CGCIp0IRDBETKCFHsdTNSDmbDERu](https://github.com/user-attachments/assets/d14fad80-0e05-4294-9cf6-753d63a5d71e)

The secure checkout page where users can finalize their booking by providing payment details and reviewing their selections.

---

### **My Booked Tours**
![127 0 0 1_3000_my-tours](https://github.com/user-attachments/assets/f3ab8065-fb3b-43bb-bc90-ee6a56ba3b64)


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

5. The API will be available at `http://localhost:3000`

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

