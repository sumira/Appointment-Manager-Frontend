import React, { useState, useEffect } from "react";
import { createAppointment, getBookedSlots } from "../api";

interface BookedSlot {
  date: string;
  startTime: string;
}

const AppointmentForm = () => {
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    "18:00-18:30",
    "18:30-19:00",
    "19:00-19:30",
    "19:30-20:00",
    "20:00-20:30",
    "20:30-21:00",
    "21:00-21:30",
    "21:30-22:00",
  ];

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!date) return;

      setLoading(true);
      try {
        const bookedSlots: BookedSlot[] = await getBookedSlots();

        const filteredSlots = timeSlots.filter((slot) => {
          const [slotStartTime] = slot.split("-");
          return !bookedSlots.some(
            (bookedSlot: BookedSlot) =>
              bookedSlot.date === date &&
              bookedSlot.startTime === `${slotStartTime}:00`
          );
        });

        setAvailableSlots(filteredSlots);
      } catch (err) {
        console.error("Error fetching booked slots:", err);
        setError("Failed to fetch available slots");
      } finally {
        setLoading(false);
      }
    };

    setSelectedSlot("");
    fetchAvailableSlots();
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setError("Please select a timeslot.");
      return;
    }

    const [startTime, endTime] = selectedSlot.split("-");

    try {
      await createAppointment({
        date,
        startTime: startTime + ":00",
        endTime: endTime + ":00",
      });
      alert("Appointment created successfully!");
      setDate("");
      setSelectedSlot("");
    } catch (error) {
      console.error("Error creating appointment", error);
      setError("Failed to create appointment");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-gray-100 min-h-screen py-6 sm:py-12 flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-0 xl:max-w-screen-sm">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Create Appointment
            </h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
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
                  onChange={(e) => setDate(e.target.value)}
                  required
                  min={today}
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="timeSlot"
                >
                  Available Time Slots
                </label>
                {loading ? (
                  <p className="text-gray-600">Loading available slots...</p>
                ) : (
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="timeSlot"
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    required
                    disabled={!date || availableSlots.length === 0}
                  >
                    <option value="">
                      {!date
                        ? "Select a date first"
                        : availableSlots.length === 0
                        ? "No available slots for this date"
                        : "Select a time slot"}
                    </option>
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
                disabled={!selectedSlot || loading}
              >
                Create Appointment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
