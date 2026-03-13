# 🍔 Bite Hub

A full-stack food ordering app built with the MERN stack. Users can browse the menu, add items to cart, place orders, track delivery, and chat with support in real time. Admins can manage orders, menu items, and respond to support chats.

**Live:** https://srm-bite-hub.vercel.app

---

## Tech Stack

- **MongoDB + Mongoose** — database
- **Express.js + Node.js** — REST API
- **React.js + Tailwind CSS** — frontend
- **Socket.io** — real-time support chat
- **JWT + Google OAuth** — authentication

---

## Features

- Register / Login with email or Google
- Browse menu, filter by category, add to cart
- Place orders with Card / UPI / COD payment
- 5-step order tracking (Pending → Delivered)
- Real-time chat with support team
- Admin panel to manage orders, menu, and chats

---

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/shiwank05/Bite_Hub.git
cd Bite_Hub
```

### 2. Backend setup
```bash
cd server
npm install
```

Create a `.env` file in `/server`:
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
```

Seed the database:
```bash
node seedData.js   # 18 food items
node seedAdmin.js  # admin account
```

```bash
npm run dev
```

### 3. Frontend setup
```bash
cd client
npm install
npm run dev
```

Runs at `http://localhost:5173`

---


## Deployment

| | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://srm-bite-hub.vercel.app |
| Backend | Render | https://bite-hub-server.onrender.com |
| Database | MongoDB Atlas | Cloud |
