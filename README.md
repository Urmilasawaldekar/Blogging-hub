# 📝 Blogging Hub

**Blogging Hub** is a full-stack MERN application that enables users to create, read, update, and delete blog posts. It features secure JWT authentication, image uploads with Multer, and a sleek responsive UI built with Tailwind CSS.

---

## 🚀 Tech Stack

| Layer       | Technology          |
|------------|---------------------|
| Frontend   | React, Tailwind CSS |
| Backend    | Node.js, Express    |
| Database   | MongoDB             |
| Auth       | JWT                 |
| File Upload| Multer              |

---

## 📦 Features

- ✅ JWT-based authentication (Register/Login)
- 📝 Create, edit, and delete blog posts
- 📁 Image upload using Multer
- 🎨 Tailwind CSS for stylish and responsive UI
- 🔍 RESTful API endpoints
- 🌐 MongoDB integration

---

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/blogging-hub.git
cd blogging-hub

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` folder with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
