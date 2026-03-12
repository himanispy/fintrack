# 💸 FinTrack — Personal Expense Manager

A full-stack expense tracking app with React frontend + Node.js/Express backend + MongoDB.

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
# Edit .env with your MongoDB URI
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 3. Environment Variables (backend/.env)
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/fintrack
JWT_SECRET=your_secret_key_here
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| GET | /api/expenses | Get all expenses |
| POST | /api/expenses | Add expense |
| DELETE | /api/expenses/:id | Delete expense |
| GET | /api/expenses/analytics/summary | Analytics |
| GET | /api/budget | Get budget |
| POST | /api/budget | Set budget |

## 🗂 Tech Stack
- **Frontend:** React 18, Axios, Custom SVG Charts
- **Backend:** Node.js, Express.js, JWT, bcryptjs
- **Database:** MongoDB + Mongoose
- **Auth:** JWT Tokens (7-day expiry)

## ✨ Features
- 🔐 Secure JWT Authentication
- 📊 Real-time analytics with pie/bar charts
- 💰 Budget management with smart alerts
- 🗑 Full CRUD for expenses
- 📱 Dark, responsive UI
