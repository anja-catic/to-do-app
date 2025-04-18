import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";

const TaskStats = ({ tasks }) => {
  const statusData = [
    { name: "todo", value: tasks.filter((t) => t.status === "todo").length },
    { name: "in_progress", value: tasks.filter((t) => t.status === "in_progress").length },
    { name: "done", value: tasks.filter((t) => t.status === "done").length },
  ];

  const priorityData = [
    { name: "Low", value: tasks.filter((t) => t.priority === "Low").length },
    { name: "Medium", value: tasks.filter((t) => t.priority === "Medium").length },
    { name: "High", value: tasks.filter((t) => t.priority === "High").length },
  ];

  const COLORS = ["#82ca9d", "#ffc658", "#ff6666"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-white">Tasks by Status</h3>
        <BarChart width={300} height={200} data={statusData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-white">Tasks by Priority</h3>
        <PieChart width={400} height={250}>
          <Pie
            data={priorityData}
            cx="40%"
            cy="50%"
            labelLine={false}
            label={({ name }) => name}
            outerRadius={80}
            dataKey="value"
          >
            {priorityData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="vertical" verticalAlign="middle" align="right" />
        </PieChart>

      </div>
    </div>
  );
};

export default TaskStats;
