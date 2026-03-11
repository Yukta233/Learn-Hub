Online Learning Platform
Overview

This project is a full-stack online learning platform where users can browse courses, watch learning videos, take quizzes, and track their learning progress through an analytics dashboard.

The platform is designed to simulate the core features of modern e-learning systems such as Coursera or Udemy, including course progress tracking, quiz attempt history, and visual analytics for learning performance.

Features
User Features

Browse and enroll in courses

Watch course videos

Track completed videos

Take quizzes related to courses

View quiz attempt history

Monitor learning progress with analytics dashboard

Progress Dashboard

The Progress Page provides detailed analytics about the user’s learning activity, including:

Total courses tracked

Total quiz attempts

Total videos completed

Quiz attempts per course visualization

Videos completed per course visualization

Video completion progress bars

Latest quiz score display

Quiz attempt history with timestamps

Analytics & Visualizations

The platform includes custom-built visual components such as:

Bar charts for quiz attempts

Bar charts for video completion

Mini attempt score charts

Video completion progress bars

Per-course learning statistics

Tech Stack
Frontend

React

Vite

JavaScript

CSS

SVG-based custom charts

Backend

Node.js

Express.js

Database

MongoDB

API Communication

Axios for API requests

Project Structure
client/
│
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   │
│   ├── pages/
│   │   └── Progress.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   └── main.jsx
│
server/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── config/
└── server.js

Create a .env file inside the server folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Installation
1. Clone the repository
git clone https://github.com/yourusername/online-learning-platform.git
2. Install dependencies

Frontend:

cd client
npm install

Backend:

cd server
npm install
3. Run the application

Start backend:

npm start

Start frontend:

npm run dev

The application will run at:

http://localhost:5173
