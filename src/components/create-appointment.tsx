import React, { useState } from "react";
import { createAppointment } from "../api";

const AppointmentForm = () => {
  const [slot, setSlot] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAppointment(slot);
      alert("Appointment created!");
      setSlot("");
    } catch (error) {
      console.error("Error creating appointment", error);
      alert("Failed to create appointment");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Create Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="slot"
            >
              Slot
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="slot"
              type="datetime-local"
              value={slot}
              onChange={(e) => setSlot((e.target as HTMLInputElement).value)}
              required
            />
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
