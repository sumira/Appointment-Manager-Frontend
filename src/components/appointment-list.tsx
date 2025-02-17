import React, { useState, useEffect } from "react";
import { getAppointments, deleteAppointment, Appointment } from "../api";
import { useNavigate } from "react-router-dom";

interface AppointmentListProps {}

const AppointmentList: React.FC<AppointmentListProps> = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
        onClick={() => navigate("/createAppointment")}
      >
        Create An Appointment
      </button>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul className="list-none">
          {appointments.map((appointment) => (
            <li
              key={appointment.id}
              className="mb-2 p-4 border rounded shadow-md"
            >
              <span className="mr-4">
                {appointment.date} {appointment.startTime} -{" "}
                {appointment.endTime}
              </span>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => handleDelete(appointment.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AppointmentList;
