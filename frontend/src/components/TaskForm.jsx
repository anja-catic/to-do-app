import React, { useState } from "react";
import axios from "axios";

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://127.0.0.1:8000/lists/1/tasks",
        {
          title,
          description: desc,
          priority,
          due_date: dueDate || null,
          status: "todo",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      setDesc("");
      setPriority("Low");
      setDueDate("");
      onTaskAdded();
    } catch (error) {
      console.error("❌ Error adding task:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-2 items-center">
      <input
        type="text"
        placeholder="Title"
        className="border p-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description"
        className="border p-2"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="border p-2"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <input
        type="date"
        className="border p-2"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        ➕ Add Task
      </button>
    </form>
  );
};

export default TaskForm;
