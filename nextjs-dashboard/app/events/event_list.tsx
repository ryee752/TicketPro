"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Event = {
  event_id: string;
  org_id: string;
  title: string;
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
  image: string; // BLOB data encoded as base64
  type: string;
  description: string;
};

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [hasMore, setHasMore] = useState(true); // To determine if more data is available

  const fetchEvents = async () => {
    if (loading || !hasMore) return; // Prevent multiple fetches or fetching when no more data

    setLoading(true);

    try {
      const response = await fetch(`/api/events`);
      if (!response.ok) throw new Error("Failed to fetch events");

      const data = await response.json();

      // Assuming the API wraps the events in an object, extract the array
      const newEvents = Array.isArray(data) ? data : data.events || [];

      setEvents((prevEvents) => [...newEvents]); // Append new events
      setHasMore(newEvents.length > 0); // If no events are returned, stop fetching
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(); // Fetch events when the component mounts
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header with "Create Event" Button */}
      <div className="relative flex items-center justify-between bg-blue-500 p-4 text-white">
        <h1 className="text-xl font-bold">Event List</h1>
        <Link
          href="/events/create_event"
          className="absolute right-4 bg-white text-blue-500 px-4 py-2 rounded-lg font-medium shadow-md hover:bg-gray-200"
        >
          Create Event
        </Link>
      </div>

      {/* Event Cards */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link key={event.event_id} href={`/events/${event.event_id}`}>
            <div
              key={event.event_id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Event Image */}
              {event.image && (
                <img
                  src={`data:image/jpeg;base64,${event.image}`} // Convert BLOB to base64
                  alt={event.event_id}
                  className="w-full h-48 object-cover"
                />
              )}

              {/* Event Details */}
              <div className="p-4">
                <h2 className="text-lg font-bold">{event.title}</h2>
                <p className="text-sm text-gray-600">
                  {event.city}, {event.state}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(event.start_time).toLocaleDateString()}{" "}
                  {new Date(event.start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {event.type && (
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full ${
                      event.type === "Conferences"
                        ? "bg-green-100 text-green-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {event.type}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {loading && <p className="text-center mt-4">Loading more events...</p>}
      {!hasMore && (
        <p className="text-center mt-4">No more events available.</p>
      )}
    </main>
  );
}
