# 📝 To-do App

Welcome to the **To-do App**, a full-stack task management application developed with **React** for the frontend and **FastAPI** (Python) for the backend.

## 🔧 Features

- ✅ User authentication (Register / Login)
- 🗂️ Task creation with priority, status, and deadlines
- 📦 Archive and unarchive tasks
- 📊 Task statistics by status and priority
- 📅 Calendar view of tasks
- 🌙 Light/Dark mode toggle
- 📌 Filtering and sorting by priority, status, and due date
- 🔒 JWT-based authentication
- 🖼️ Responsive design with TailwindCSS

## 🛠️ Tech Stack

**Frontend:**
- React
- React Router
- Axios
- Tailwind CSS
- Recharts

**Backend:**
- FastAPI
- SQLAlchemy
- JWT authentication
- SQLite

## 🚀 Getting Started

### 📦 Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

3. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

### 💻 Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the React app:
   ```bash
   npm start
   ```

4. The frontend will be available at `http://localhost:3000`.

## 📁 Folder Structure

```
to-do-app/
├── backend/
│   ├── app/
│   ├── todo.db
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   └── ...
```

## ✨ Credits

Made with ❤️ by Anja Catić

---

Feel free to ⭐ the repo if you like the project!