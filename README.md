# ⚡ TaskSphere – Full-Stack CRUD App with JWT Auth & E2E Encryption

**TaskSphere** is a secure and modern **MERN stack** (MongoDB, Express, React, Node.js) web application that demonstrates full-stack CRUD operations with **JWT authentication**, **role-based access control**, and **end-to-end encryption** for user data privacy.

---

## 🚀 Features

- 🔐 **JWT Authentication** – Secure login & signup with token-based sessions  
- 🧠 **End-to-End Encryption** – Task data encrypted using public/private key pairs  
- 🗂️ **Full CRUD Operations** – Create, Read, Update, Delete tasks efficiently  
- 🧰 **RESTful API** – Modular and scalable backend with Express.js  
- ⚙️ **Role-Based Access** – Manage permissions for different user roles  
- 🎨 **React Frontend** – Clean, responsive, and intuitive user interface  
- ☁️ **Environment Config** – Secure `.env` variables for dev & production  
- 🌍 **Deployment Ready** – Easily deployable on Render, Railway, or Vercel  

---

## 🏗️ Project Architecture

```
TaskSphere/
├── backend/
│   ├── config/        # MongoDB connection & environment setup
│   ├── controllers/   # API logic (Auth, Tasks)
│   ├── middleware/    # JWT & encryption middlewares
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Auth & Task routes
│   └── server.js      # Express app entry
│
├── frontend/
│   ├── src/
│   │   ├── api/       # Axios API calls
│   │   ├── components/# Reusable UI components
│   │   ├── pages/     # Login, Register, Dashboard
│   │   └── App.jsx    # Main React entry
│   └── vite.config.js # Vite config
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository
```bash
git clone https://github.com/jadhav045/TaskSphere-E2E-Encryption.git
cd tasksphere
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```
Create `.env` file:
```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```
Run server:
```bash
npm run dev
```

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React (Vite), Axios, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Security | JWT, Bcrypt, E2E RSA Encryption |
| Deployment | Render / Vercel / Railway |

---

## 🔒 Security Highlights

- Passwords hashed using **bcrypt**
- Tokens signed with **JWT & HTTPS-only cookies**
- Sensitive data encrypted with **asymmetric RSA keys**
- API requests authenticated via Bearer token middleware

---

## 🧩 Future Enhancements

- 📝 **Daily Diary Feature:** Extend TaskSphere to include an end-to-end encrypted daily diary module where users can securely log and manage personal notes with full privacy.

---

## 📸 Screenshots

> *(Add screenshots of login page, dashboard, and task encryption UI here)*

---

## 🧑‍💻 Author

**Developed by [Your Name]**  
💼 Passionate about building secure, scalable, and privacy-focused web applications.  
🌐 [LinkedIn](#) • [Portfolio](#) • [GitHub](#)

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

⭐ **Star this repo** if you found it useful — your support motivates continuous improvements!

