"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Event = {
  event_id: string;
  start_time: string;
  end_time: string;
  date: string;
  capacity: number;
  waitlist_capacity: number;
  price: number;
  street: string;
  city: string;
  state: string;
  zipcode: string;
};

const sampleEventData: Event[] = [
  {
    event_id: "EV001",
    start_time: "2024-12-01 18:00:00",
    end_time: "2024-12-01 21:00:00",
    date: "2024-12-01",
    capacity: 100,
    waitlist_capacity: 20,
    price: 50.0,
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipcode: "10001",
  },
  {
    event_id: "EV002",
    start_time: "2024-12-05 14:00:00",
    end_time: "2024-12-05 16:00:00",
    date: "2024-12-05",
    capacity: 50,
    waitlist_capacity: 10,
    price: 25.5,
    street: "456 Elm St",
    city: "Los Angeles",
    state: "CA",
    zipcode: "90001",
  },
  {
    event_id: "EV003",
    start_time: "2024-12-10 19:30:00",
    end_time: "2024-12-10 22:00:00",
    date: "2024-12-10",
    capacity: 200,
    waitlist_capacity: 50,
    price: 75.0,
    street: "789 Oak Ave",
    city: "Chicago",
    state: "IL",
    zipcode: "60601",
  },
  {
    event_id: "EV004",
    start_time: "2024-12-15 09:00:00",
    end_time: "2024-12-15 12:00:00",
    date: "2024-12-15",
    capacity: 80,
    waitlist_capacity: 15,
    price: 30.0,
    street: "321 Maple Rd",
    city: "Houston",
    state: "TX",
    zipcode: "77001",
  },
  {
    event_id: "EV005",
    start_time: "2024-12-20 20:00:00",
    end_time: "2024-12-20 23:59:00",
    date: "2024-12-20",
    capacity: 150,
    waitlist_capacity: 25,
    price: 100.0,
    street: "654 Pine Ln",
    city: "Miami",
    state: "FL",
    zipcode: "33101",
  },
];

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // In a real app, fetch the data from an API
    setEvents(sampleEventData); // Simulated fetch
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header with "Create Event" Button */}
      <div className="flex items-center justify-between bg-blue-500 p-4 text-white">
        <h1 className="text-xl font-bold">Event List</h1>
        <Link
          href="/events/create_event"
          className="bg-white text-blue-500 px-4 py-2 rounded-lg font-medium shadow-md hover:bg-gray-200"
        >
          Create Event
        </Link>
      </div>

      {/* Event List Table */}
      <div className="p-6">
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-left text-sm uppercase text-gray-700">
                <th className="px-4 py-2">Event ID</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Start Time</th>
                <th className="px-4 py-2">End Time</th>
                <th className="px-4 py-2">Capacity</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Location</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.event_id} className="border-b">
                  <td className="px-4 py-2">{event.event_id}</td>
                  <td className="px-4 py-2">{event.date}</td>
                  <td className="px-4 py-2">{event.start_time}</td>
                  <td className="px-4 py-2">{event.end_time}</td>
                  <td className="px-4 py-2">{event.capacity}</td>
                  <td className="px-4 py-2">${event.price.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    {event.street}, {event.city}, {event.state}, {event.zipcode}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
