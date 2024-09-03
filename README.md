# MERN Stack Project

Rehaish - Real Estate Web Application
Rehaish is a full-stack real estate web application built using the MERN stack (MongoDB, Express, React, Node.js). It allows users to sign up, log in, and manage property listings efficiently. The platform provides an intuitive interface for property upload, updates, and deletion, making it a comprehensive solution for managing real estate listings.

Features
User Authentication: Secure sign-up and login functionality using JWT. Google Sign-In integration for a seamless login experience.
Property Management: Users can upload, update, and delete property listings with support for multiple images, videos, and detailed property information.
User Profile Management: Users can update personal details and profile pictures, creating a personalized experience.
Responsive Design: Built with Tailwind CSS for a modern, responsive design across all devices.
Real-Time Updates: Dynamic property listing updates, ensuring the latest information is always displayed.
Tech Stack
Frontend: React, Tailwind CSS
Backend: Node.js, Express
Database: MongoDB
Authentication: JSON Web Tokens (JWT), Google OAuth

To run this project locally, follow these steps:

1.Clone the repository:

git clone https://github.com/your-username/rehaish.git
cd rehaish

2.Install server dependencies:
cd server
npm install

3.Install client dependencies:
cd client
npm install

4.Set up environment variables:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

5.Run the server and client:

In the server directory:
node index.js

In the client directory:
npm start
