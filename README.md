# Rabuste-Coffee-Project-GWOC-26-

A full-stack coffee shop management platform featuring a customer frontend, an administrative dashboard, and a robust backend API. This project was developed as part of the Google Winter of Code (GWOC) 2025-26.

## 🚀 Project Structure

The repository is organized into three main directories:

- **`/project_frontend`**: The customer-facing React application. Includes features like product browsing, 3D coffee cup previews, shopping cart, and Razorpay integration.
- **`/admin_panel`**: A dedicated React dashboard for administrators to manage menu items, track orders, oversee workshops, and manage AI configurations.
- **`/backend`**: Node.js and Express server providing the REST API. It handles MongoDB interactions, image uploads via Cloudinary, and automated email notifications.

## ✨ Key Features

### Frontend (Customer)
- **3D Interactive Experience**: Integration of Three.js and Spline for immersive product viewing.
- **E-commerce Workflow**: Complete shopping cart system with persistent state management.
- **Secure Payments**: Integration with Razorpay for handling transactions.
- **Order Tracking**: Real-time tracking of order status.

### Admin Panel
- **Dashboard Analytics**: Overview of sales, orders, and workshop registrations.
- **Content Management**: Full CRUD operations for the coffee menu and art gallery.
- **Workshop Management**: Tools to schedule workshops and manage participant registrations.
- **AI Management**: Configure and monitor AI-driven features for the platform.

### Backend
- **Scalable API**: Built with Express and structured for maintainability.
- **Database**: MongoDB integration using Mongoose models for Arts, Items, Orders, and Workshops.
- **Media Hosting**: Automated image processing and hosting using Cloudinary.
- **Communication**: Automated email utility for order confirmations and enquiries.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Three.js.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **Utilities**: Cloudinary (Images), Razorpay (Payments), Nodemailer (Emails).

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB account/URI
- Cloudinary API credentials
- Razorpay API keys

### Installation

1. **Clone the repository**:
   ```bash
   git clone [https://github.com/shravyapatel2803/rabuste-coffee-project-gwoc-26-.git](https://github.com/shravyapatel2803/rabuste-coffee-project-gwoc-26-.git)

   cd rabuste-coffee-project-gwoc-26-
