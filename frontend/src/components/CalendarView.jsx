import React, { useState, useContext } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Dark mode klasa prepoznaje da li treba dodati tamni izgled
  const isDark = document.body.classList.contains("dark");

  return (
    <div className={`mt-6 p-4 rounded shadow ${isDark ? "bg-gray-800 text-white" : "bg-white"}`}>
      <h2 className="text-xl font-bold mb-2">📆 Calendar</h2>
      <div className={isDark ? "dark" : ""}>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
        />
      </div>
      <p className={`mt-4 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
        Selected date: {selectedDate.toLocaleDateString()}
      </p>
    </div>
  );
};

export default CalendarView;
