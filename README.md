# 📚 Online Learning Platform (Full Stack - AWS Deployed)

A full-stack online learning management system (LMS) where users can browse courses, watch learning videos, attempt quizzes, and track their learning progress through a real-time analytics dashboard.

The platform simulates core features of modern e-learning systems like Coursera and Udemy, with full production deployment using AWS and MongoDB Atlas.

---

# 🚀 Live Architecture

Frontend (React + Vite) → AWS S3 (Hosting)  
Backend (Node.js + Express) → AWS EC2 (PM2 Managed Server)  
Database → MongoDB Atlas (Cloud Database)

---

# ✨ Features

## 👤 User Features
- Browse and enroll in courses  
- Watch course video lectures  
- Track completed videos  
- Attempt quizzes for each course  
- View quiz history with timestamps  
- Monitor learning progress in real time  

---

## 📊 Progress Dashboard
The analytics dashboard includes:

- Total courses enrolled  
- Total quiz attempts  
- Total videos completed  
- Quiz attempts per course  
- Video completion per course  
- Progress bars for completion tracking  
- Latest quiz score display  
- Full quiz attempt history  

---

## 📈 Analytics & Visualizations
- SVG-based bar charts for quiz attempts  
- Video completion charts per course  
- Progress bars for learning tracking  
- Mini score visualization  
- Course-wise performance analytics  

---

# 🛠 Tech Stack

## Frontend
- React (Vite)
- JavaScript (ES6+)
- CSS3
- Axios
- Custom SVG Charts

## Backend
- Node.js
- Express.js
- JWT Authentication
- REST APIs

## Database
- MongoDB Atlas (Cloud Database)

## Deployment (AWS)
- AWS S3 → Frontend Hosting  
- AWS EC2 → Backend Hosting  
- PM2 → Process Manager (24/7 uptime)  
- AWS Security Groups → Port management  

---

# 📁 Project Structure
client/
│
├── src/
│ ├── components/
│ │ └── Navbar.jsx
│ ├── pages/
│ │ └── Progress.jsx
│ ├── services/
│ │ └── api.js
│ └── main.jsx
│
server/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── config/
└── server.js

# 🔐 Environment Variables

Create a `.env` file inside the `server/` folder:


PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key


---

# ⚙️ Installation & Setup

## 1. Clone Repository

git clone https://github.com/yourusername/online-learning-platform.git
cd online-learning-platform


## 2. Install Dependencies

Frontend:

cd client
npm install


Backend:

cd server
npm install


---

# 🧪 Run Locally

## Start Backend

cd server
npm start


## Start Frontend

cd client
npm run dev


Frontend runs at:

http://localhost:5173


---

# 🌐 Production Deployment (AWS)

## 🚀 Frontend (S3)
1. Build project:

npm run build


2. Upload `dist/` or `build/` folder to AWS S3  
3. Enable static website hosting  
4. (Optional) Attach CloudFront CDN  

---

## 🚀 Backend (EC2 + PM2)

SSH into EC2:

ssh -i backend-key.pem ubuntu@YOUR_EC2_IP


Install dependencies:

cd server
npm install


Start backend using PM2:

pm2 start server.js --name backend
pm2 save
pm2 startup


Open AWS Security Group:
- Port: 5000
- Source: 0.0.0.0/0

Backend runs at:

http://YOUR_EC2_IP:5000


---

## 🗄 Database (MongoDB Atlas)

- Create free M0 cluster  
- Create database user  
- Whitelist EC2 IP or allow `0.0.0.0/0`  
- Paste connection string in `.env`  

---

# 🔗 API Base URL


http://YOUR_EC2_IP:5000


Update frontend API:

http://localhost:5000 → http://EC2_IP:5000


---

# 🧠 Key Learnings

- Full-stack MERN-style architecture  
- AWS S3 + EC2 deployment  
- MongoDB Atlas integration  
- PM2 process management  
- REST API development  
- Production-level deployment workflow  

---

# 📌 Future Improvements

- Real-time notifications using WebSockets  
- AI-based course recommendations  
- Payment gateway integration  
- Admin dashboard  
- Video streaming optimization  

---

# 👨‍💻 Author

Built as a full-stack project to demonstrate:
- Cloud deployment skills  
- Backend API development  
- Frontend UI/UX design  
- Scalable system architecture  
