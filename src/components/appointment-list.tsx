import React, { useState, useEffect } from "react";
import { getAppointments, deleteAppointment } from "../api";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaTrash,
  FaCalendar,
  FaClock,
  FaList,
  FaSignOutAlt,
} from "react-icons/fa";

interface Appointment {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface AppointmentListProps {}

const AppointmentList: React.FC<AppointmentListProps> = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments", error);
      }
    };
    fetchAppointments();

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setViewMode("calendar");
      } else {
        setViewMode("list");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteAppointment(id);
      setAppointments(
        appointments.filter((appointment) => appointment.id !== id)
      );
    } catch (error) {
      console.error("Error deleting appointment", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const generateCalendarData = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return weeks;
  };

  const calendarData = generateCalendarData();

  const getAppointmentsForDay = (day: number | null) => {
    if (day === null) return [];
    const now = new Date();
    const dateString = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return appointments.filter((app) => app.date === dateString);
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Your Appointments</h2>

      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
          onClick={() => navigate("/createAppointment")}
        >
          <FaPlus className="mr-2" />
          Create An Appointment
        </button>

        <div className="hidden md:flex space-x-2 items-center">
          <button
            className={`p-2 rounded ${
              viewMode === "calendar" ? "bg-blue-100" : "bg-gray-100"
            }`}
            onClick={() => setViewMode("calendar")}
          >
            <FaCalendar
              className={
                viewMode === "calendar" ? "text-blue-500" : "text-gray-500"
              }
            />
          </button>
          <button
            className={`p-2 rounded ${
              viewMode === "list" ? "bg-blue-100" : "bg-gray-100"
            }`}
            onClick={() => setViewMode("list")}
          >
            <FaList
              className={
                viewMode === "list" ? "text-blue-500" : "text-gray-500"
              }
            />
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      <div
        className={`${
          viewMode === "calendar" ? "block" : "hidden"
        } md:block lg:block`}
      >
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex items-center justify-center py-4 px-6 bg-blue-50">
              <h2 className="font-semibold text-lg text-gray-800">
                {new Date().toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="bg-gray-100 py-2 text-center text-gray-600 text-sm"
                >
                  {day}
                </div>
              ))}

              {calendarData.map((week, weekIndex) => (
                <React.Fragment key={weekIndex}>
                  {week.map((day, dayIndex) => {
                    const dayAppointments = getAppointmentsForDay(day);
                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`min-h-32 bg-white border-t border-gray-200 p-1 ${
                          day === null ? "bg-gray-50" : ""
                        } ${day === new Date().getDate() ? "bg-blue-50" : ""}`}
                      >
                        {day !== null && (
                          <>
                            <span className="text-sm font-medium">{day}</span>
                            <div className="mt-1 space-y-1">
                              {dayAppointments.map((appointment) => (
                                <div
                                  key={appointment.id}
                                  className="bg-blue-100 text-blue-800 text-xs p-1 rounded flex justify-between items-center"
                                >
                                  <span className="truncate">
                                    {appointment.startTime.substring(0, 5)}{" "}
                                    {"PM"} -
                                    {appointment.endTime.substring(0, 5)} {"PM"}
                                  </span>
                                  <button
                                    onClick={() => handleDelete(appointment.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <FaTrash size={10} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        className={`${
          viewMode === "list" || window.innerWidth < 768 ? "block" : "hidden"
        } md:hidden max-w-lg mx-auto`}
      >
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <ul className="list-none space-y-3">
            {appointments.map((appointment) => (
              <li key={appointment.id} className="p-3 border rounded shadow-md">
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <FaCalendar className="mr-2 text-gray-600" />
                    <span className="text-sm">Date: {appointment.date}</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <FaClock className="mr-2 text-gray-600" />
                    <span className="text-sm">
                      <span className="font-semibold">From:</span>{" "}
                      {appointment.startTime} {"PM "}
                      {"  "}
                      <span className="font-semibold">To:</span>
                      {"PM"}
                      {appointment.endTime}
                    </span>
                  </div>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white text-sm py-1 px-3 rounded focus:outline-none focus:shadow-outline flex items-center justify-center self-end"
                    onClick={() => handleDelete(appointment.id)}
                  >
                    <FaTrash className="mr-1" />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;
