import React, { useEffect, useState } from "react";
import API from "../services/api";
import TaskCard from "../components/TaskCard";
import { useNavigate } from "react-router-dom";

const ArchivedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const fetchArchivedTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.get("/tasks/archived", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching archived tasks", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchArchivedTasks();
    }
  }, [navigate]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📁 Archived Tasks</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          🧾 Back to Dashboard
        </button>
      </div>

      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <p>No archived tasks.</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onTaskUpdated={fetchArchivedTasks} // 👈 mora ovo
              isArchived={true}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ArchivedTasks;
