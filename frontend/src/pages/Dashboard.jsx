import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api"; 
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import CalendarView from "../components/CalendarView";
import TaskStats from "../components/TaskStats";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOption, setSortOption] = useState("none");
  const [darkMode, setDarkMode] = useState(false);
  const [dueSoonCount, setDueSoonCount] = useState(0); // 🔔 nova state za due soon

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchTasks();
    }
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);

      // 📅 Provera za due soon zadatke
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);

      const dueSoon = response.data.filter((task) => {
        const dueDate = task.due_date && new Date(task.due_date);
        return dueDate && dueDate > now && dueDate <= tomorrow && task.status !== "done";
      });

      setDueSoonCount(dueSoon.length);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to load tasks.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleTaskUpdate = () => {
    fetchTasks();
  };

  const filteredTasks = tasks
    .filter((task) => {
      const matchPriority =
        priorityFilter === "All" || task.priority === priorityFilter;
      const matchStatus =
        statusFilter === "All" || task.status === statusFilter;
      return matchPriority && matchStatus;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "due-asc":
          return new Date(a.due_date) - new Date(b.due_date);
        case "due-desc":
          return new Date(b.due_date) - new Date(a.due_date);
        case "priority-asc": {
          const order = { Low: 1, Medium: 2, High: 3 };
          return order[a.priority] - order[b.priority];
        }
        case "priority-desc": {
          const order = { Low: 1, Medium: 2, High: 3 };
          return order[b.priority] - order[a.priority];
        }
        default:
          return 0;
      }
    });

  return (
    <div
      className={`p-6 min-h-screen transition duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📜 My Tasks</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/archived")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
          >
            View Archived
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      <TaskForm onTaskAdded={fetchTasks} />

      {/* 🔔 Notifikacija za due soon */}
      {dueSoonCount > 0 && (
        <div className="mb-4 p-3 rounded bg-yellow-100 text-yellow-800 font-medium border border-yellow-300">
          ⚠️ You have {dueSoonCount} task{dueSoonCount > 1 ? "s" : ""} due soon!
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <label className="font-medium">Priority:</label>
        <select
          className="border p-2 rounded text-black"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <label className="font-medium">Status:</label>
        <select
          className="border p-2 rounded text-black"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <label className="font-medium">Sort by:</label>
        <select
          className="border p-2 rounded text-black"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="none">None</option>
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
          <option value="due-asc">Due Date (Asc)</option>
          <option value="due-desc">Due Date (Desc)</option>
          <option value="priority-asc">Priority (Low-High)</option>
          <option value="priority-desc">Priority (High-Low)</option>
        </select>
      </div>

      {message && <p className="text-red-500">{message}</p>}
      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          filteredTasks.map((task, index) => (
            <div
              key={task.id}
              className="transition-opacity duration-300 ease-in-out animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TaskCard task={task} onTaskUpdated={handleTaskUpdate} />
            </div>
          ))
        )}
      </div>

      <div className="mt-10">
        <TaskStats tasks={tasks} />
      </div>

      <div className="mt-10">
        <CalendarView />
      </div>
    </div>
  );
};

export default Dashboard;
