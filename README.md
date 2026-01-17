# InstiLeaks

InstiLeaks is a campus-exclusive Gen-Z social platform built for institute communities. It enables students to share anonymous confessions, memes, polls, and participate in real-time discussions while keeping the platform restricted to a closed campus ecosystem.

---

## Features

- Anonymous confessions and posts
- Meme and media sharing
- Polls and engagement-based interactions
- Real-time updates using WebSockets
- Campus-restricted access model
- Dedicated media upload microservice

---

## Project Structure
InstiLeaks/
├── frontend/
│ ├── public/
│ ├── src/
│ ├── dist/
│ ├── index.html
│ ├── vite.config.js
│ ├── netlify.toml
│ ├── package.json
│ └── README.md
│
├── backend/
│ ├── middlewares/
│ ├── routes/
│ ├── schemas/
│ ├── services/
│ ├── sockets/
│ ├── utils/
│ ├── static/
│ ├── app.js
│ ├── package.json
│ └── readme.md
│
├── uploader-microservice/
│ ├── app.js
│ ├── package.json
│ └── .env
│
└── README.md


---

## Tech Stack

### Frontend
- React.js
- Vite
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- WebSockets

### Architecture
- Service-based backend separation
- Dedicated uploader microservice
- REST APIs with real-time communication

---

## Setup & Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/instileaks.git
cd instileaks
# Backend
cd backend
npm run dev

# Uploader microservice
cd uploader-microservice
npm run dev

# Frontend
cd frontend
npm run dev
