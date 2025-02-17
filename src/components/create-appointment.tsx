import React, { useState } from "react";
import { createAppointment } from "../api";

const AppointmentForm = () => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("18:30");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      //   const slot = `${date}T${startTime}:00-${endTime}:00`;
      await createAppointment({ date, startTime, endTime });
      alert("Appointment created!");
      setDate("");
      setStartTime("18:00");
      setEndTime("18:30");
    } catch (error) {
      console.error("Error creating appointment", error);
      alert("Failed to create appointment");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Create Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="date"
            >
              Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate((e.target as HTMLInputElement).value)}
              required
              min={today} // Disable past dates
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="startTime"
            >
              Start Time (6:00 PM - 9:30 PM)
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="startTime"
              value={startTime}
              onChange={(e) =>
                setStartTime((e.target as unknown as HTMLInputElement).value)
              }
              required
            >
              <option value="18:00">6:00 PM</option>
              <option value="18:30">6:30 PM</option>
              <option value="19:00">7:00 PM</option>
              <option value="19:30">7:30 PM</option>
              <option value="20:00">8:00 PM</option>
              <option value="20:30">8:30 PM</option>
              <option value="21:00">9:00 PM</option>
              <option value="21:30">9:30 PM</option>
            </select>
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="endTime"
            >
              End Time (6:30 PM - 10:00 PM)
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="endTime"
              value={endTime}
              onChange={(e) =>
                setEndTime((e.target as unknown as HTMLInputElement).value)
              }
              required
            >
              <option value="18:30">6:30 PM</option>
              <option value="19:00">7:00 PM</option>
              <option value="19:30">7:30 PM</option>
              <option value="20:00">8:00 PM</option>
              <option value="20:30">8:30 PM</option>
              <option value="21:00">9:00 PM</option>
              <option value="21:30">9:30 PM</option>
              <option value="22:00">10:00 PM</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
