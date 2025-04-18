import React, { useState } from "react";
import API from "../services/api";


const TaskCard = ({ task, onTaskUpdated, isArchived = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDesc, setEditedDesc] = useState(task.description);
  const [editedStatus, setEditedStatus] = useState(task.status);
  const [editedPriority, setEditedPriority] = useState(task.priority || "Low");
  const [editedDueDate, setEditedDueDate] = useState(
    task.due_date ? task.due_date.split("T")[0] : ""
  );

  const token = localStorage.getItem("token");

  const isOverdue =
    task.due_date && new Date(task.due_date) < new Date() && task.status !== "done";

  const getCardStyle = () => {
    const baseStyle = "border rounded-lg p-4 shadow transition";
    const statusStyle = {
      todo: "bg-blue-50 border-blue-300",
      in_progress: "bg-yellow-50 border-yellow-300",
      done: "bg-green-50 border-green-300",
    }[task.status] || "bg-white";

    const overdueStyle = isOverdue ? "border-red-500 bg-red-50" : "";

    return `${baseStyle} ${statusStyle} ${overdueStyle}`;
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "Low":
        return <span className="text-green-600 font-semibold">🟢 Low</span>;
      case "Medium":
        return <span className="text-yellow-600 font-semibold">🟡 Medium</span>;
      case "High":
        return <span className="text-red-600 font-semibold">🔴 High</span>;
      default:
        return priority;
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/tasks/${task.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onTaskUpdated();
    } catch (error) {
      console.error("❌ Error deleting task:", error);
    }
  };

  const handleEdit = async () => {
    try {
      await API.put(
        `/tasks/${task.id}`,
        {
          title: editedTitle,
          description: editedDesc,
          status: editedStatus,
          priority: editedPriority,
          due_date: editedDueDate || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsEditing(false);
      onTaskUpdated();
    } catch (error) {
      console.error("❌ Error updating task:", error);
    }
  };

  const handleArchiveToggle = async () => {
    try {
      await API.patch(
        `/tasks/${task.id}/archive`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onTaskUpdated();
    } catch (error) {
      console.error("❌ Error archiving/unarchiving task:", error);
    }
  };

  const handleMarkAsDone = async () => {
    try {
      await API.patch(
        `/tasks/${task.id}`,
        null,
        {
          params: { status: "done" },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onTaskUpdated();
    } catch (error) {
      console.error("❌ Error marking task as done:", error);
    }
  };

  return (
    <div className={getCardStyle()}>
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="border p-1 w-full"
          />
          <input
            type="text"
            value={editedDesc}
            onChange={(e) => setEditedDesc(e.target.value)}
            className="border p-1 w-full"
          />
          <select
            value={editedStatus}
            onChange={(e) => setEditedStatus(e.target.value)}
            className="border p-1 w-full"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            value={editedPriority}
            onChange={(e) => setEditedPriority(e.target.value)}
            className="border p-1 w-full"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="date"
            value={editedDueDate}
            onChange={(e) => setEditedDueDate(e.target.value)}
            className="border p-1 w-full"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleEdit}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 text-black px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-semibold">{task.title}</h2>
          <p className="text-sm text-gray-600">{task.description}</p>
          <p className="text-xs text-gray-500 italic">Status: {task.status}</p>
          <p className="text-xs">Priority: {getPriorityLabel(task.priority)}</p>
          <p className="text-xs">
            Due:{" "}
            {task.due_date
              ? new Date(task.due_date).toLocaleDateString()
              : "No deadline"}
          </p>
          {isOverdue && (
            <p className="text-xs text-red-600 font-semibold">⚠️ Overdue</p>
          )}
          <div className="mt-2 flex gap-2 flex-wrap">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 text-sm hover:underline"
            >
              📝 Edit
            </button>
            {task.status !== "done" && (
              <button
                onClick={handleMarkAsDone}
                className="text-green-600 text-sm hover:underline"
              >
                ✔️ Mark as Done
              </button>
            )}
            <button
              onClick={handleArchiveToggle}
              className={`${
                isArchived ? "text-green-600" : "text-purple-600"
              } text-sm hover:underline`}
            >
              {isArchived ? "🔁 Unarchive" : "📦 Archive"}
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 text-sm hover:underline"
            >
              🗑️ Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;
