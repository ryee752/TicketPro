"use client";

import { useEffect, useState } from "react";

type Event = {
  event_id: string;
  title: string;
  start_time: string;
  end_time: string;
  capacity: number;
  waitlist_capacity: number;
  price: number;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  image: string;
  type: string;
  description: string;
  availability: string;
  org_name: string;
};

export default function EventDetailPage({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) throw new Error("Failed to fetch event details.");

        const data = await response.json();
        setEvent(data.event);
      } catch (err) {
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative bg-white shadow-md">
        <img
          src={`data:image/jpeg;base64,${event.image}`}
          alt={event.title}
          className="w-full h-100 object-cover rounded-b-lg"
        />
        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-lg shadow-md text-sm font-medium">
          {event.type}
        </div>
      </div>

      {/* Event Details Section */}
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <p className="mt-2 text-sm text-gray-600">
          Hosted by{" "}
          <span className="font-medium text-gray-900">{event.org_name}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Left Column: Event Details */}
          <div>
            <h2 className="text-xl font-bold mb-2">Event Information</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {event.description}
            </p>

            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <strong>Date:</strong>{" "}
                {new Date(event.start_time).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Time:</strong>{" "}
                {new Date(event.start_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {new Date(event.end_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <strong>Location:</strong> {event.street}, {event.city},{" "}
                {event.state} {event.zipcode}
              </p>
            </div>
          </div>

          {/* Right Column: Pricing and Actions */}
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
              ${event.price}
              <span className="text-sm font-medium text-gray-500">
                {" "}
                per ticket
              </span>
            </h2>

            <button className="w-full bg-blue-500 text-white py-3 rounded-lg shadow-md hover:bg-blue-600">
              Buy Tickets
            </button>

            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <strong>Capacity:</strong> {event.capacity} attendees
              </p>
              <p className="text-sm text-gray-600">
                <strong>Waitlist Capacity:</strong> {event.waitlist_capacity}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Availability:</strong>{" "}
                {event.availability === "available" ? (
                  <span className="text-green-500 font-medium">Available</span>
                ) : (
                  <span className="text-red-500 font-medium">Unavailable</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
