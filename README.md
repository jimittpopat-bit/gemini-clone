# 🔗 Live Demo
👉 [View Live Demo](https://your-live-demo-link-here)

---

# Gemini Chat – Full Stack App

A full-stack Gemini-style chat application built to demonstrate frontend–backend integration, authentication, and persistent data handling.

---

## 🧰 Tech Stack

### Frontend
- React
- Vite
- HTML, CSS, JavaScript
- React Context API

### Backend
- Node.js
- Express

### Database
- PostgreSQL

### Authentication
- JWT (JSON Web Tokens)

### AI
- Google Gemini API

---

## ✨ Features

- User authentication (Login & Signup)
- Create, view, and delete chats
- Persistent chat messages per user
- Protected routes with ownership checks
- Dark / Light mode (with backend sync)
- Markdown rendering for AI responses
- Clean, professional login UI

---

## 🔄 Application Flow

- User logs in and receives a JWT
- All chat routes are protected using authentication middleware
- Chats are scoped to the logged-in user
- Messages are stored and retrieved per chat
- Global state is managed using React Context
- Frontend communicates with backend via REST APIs

---

## ▶️ Running the Project Locally

### Backend
```bash
cd server
npm install
npm run dev


Frontend
cd client
npm install
npm run dev

Create a .env file using .env.example before running the project.



📚 What I Learned

Designing and working with relational database schemas

Implementing authentication and authorization using JWT

Structuring a full-stack application (client/server separation)

Managing global state and async flows in React

Debugging real-world frontend–backend integration issues



🚧 Limitations & Future Improvements

Move Gemini API calls fully to the backend

Improve centralized error handling

Add rate limiting and abuse protection

Improve scalability and logging