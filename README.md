# 🚗 Car Rental - User Website

A responsive and user-friendly web application for booking rental cars. Customers can browse available vehicles, select dates via a calendar interface, view booking details, and make secure payments via Razorpay. The app also supports user authentication and booking history.

---

## ✨ Features

- 🔍 Browse and search for available rental cars
- 📅 Select pickup and drop dates via an interactive calendar
- 🔐 User signup/login with session-based or JWT authentication
- 🧾 Booking summary with status updates
- 💳 Razorpay integration for secure UPI/card/netbanking payments
- 📖 Booking history and invoice access
- 📱 Mobile-responsive design with clean UX
- 🚀 Fully deployed to cloud hosting (e.g., Vercel or Netlify)

---

## 🛠️ Tech Stack

- **Framework**: React / Next.js  
- **Styling**: Tailwind CSS / Styled Components  
- **Routing**: React Router / Next.js Routing  
- **State Management**: Zustand
- **Authentication**: JWT / NextAuth / custom login system  
- **Payments**: Razorpay (with webhook handling via backend)  
- **Deployment**: Vercel / Netlify / Firebase Hosting

---

## 🔐 Authentication

- Signup/Login with email and password
- Auth tokens stored securely in cookies/localStorage
- Protected routes for viewing bookings or making payments

---

## 💳 Payment Integration (Razorpay)

- Razorpay embedded form or redirect flow
- Payment success/failure handling with visual feedback
- Backend webhook integration to verify payment and mark bookings as paid

---


## 🚀 Deployment

> 🔗 Live Site: [https://jaincarrental.in)  

To run locally:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
