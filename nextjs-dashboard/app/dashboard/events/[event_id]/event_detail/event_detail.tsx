"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import TicketQuantity from "./component/ticketQuantity";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/store";

type Event = {
  event_id: string;
  org_id: string;
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
  const login = useSelector((state: RootState) => state.currentLogin.value);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}/event_detail`);
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

  let image = null;

  if (event.image) {
    image = Buffer.from(event.image).toString("base64");
  }
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="relative flex items-center justify-between text-white mb-10">
        {login.type === "organization" && event.org_id === login.id ? (
          <Link
            href={`/events/${eventId}/edit_event`}
            className="absolute right-0 bg-blue-500 text-white-500 px-4 py-2 rounded-lg font-medium shadow-md hover:bg-gray-200"
          >
            Edit Event
          </Link>
        ) : null}
      </div>
      {/* Hero Section */}
      <div className="relative bg-white shadow-md flex items-center justify-center">
        <img
          src={`data:image/jpeg;base64,${image}`}
          alt={event.title}
          className="w-128 h-128 object-cover rounded-b-lg"
        />
        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-lg shadow-md text-sm font-medium">
          {event.type}
        </div>
      </div>

      {/* Event Details Section */}
      <div className="max-w-6xl mx-auto mt-4">
        <div className="bg-white shadow-lg rounded-lg text-right">
          <h1 className="text-3xl font-bold pl-2 text-center">{event.title}</h1>
          <p className="mt-2 text-sm text-gray-600 pr-2">
            Hosted by{" "}
            <span className="font-medium text-gray-900">{event.org_name}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Left Column: Event Details */}
          <div className="bg-white shadow-lg rounded-lg p-2">
            <h2 className="text-xl font-bold mb-2 ">Event Information</h2>
            <div className="mt-4">
              <h2 className="text-md font-bold mb-2">
                <strong>Date/Time:</strong>{" "}
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {`${new Date(event.start_time).toLocaleString()} - ${new Date(
                  event.end_time
                ).toLocaleString()}`}
              </p>
            </div>

            <div className="mt-4">
              <h2 className="text-md font-bold mb-2">
                <strong>Location:</strong>
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {event.street}, {event.city}, {event.state} {event.zipcode}
              </p>
            </div>

            <div className="mt-4">
              <h2 className="text-md font-bold mb-2">
                <strong>Description:</strong>
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {event.description}
              </p>
            </div>
          </div>

          {/* Right Column: Pricing and Actions */}
          <div className="p-3 bg-white shadow-lg rounded-lg max-h-64">
            <h2 className="text-2xl font-bold mb-4">
              ${event.price}
              <span className="text-sm font-medium text-gray-500">
                {" "}
                per ticket
              </span>
            </h2>

            {login.type === "user" ? (
              <div>
                <button className="w-full bg-blue-500 text-white py-3 rounded-lg shadow-md hover:bg-green-600">
                  Buy Tickets
                </button>

                <div className="mt-4">
                  <TicketQuantity />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    <strong>Capacity:</strong> {event.capacity} attendees
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Waitlist Capacity:</strong>{" "}
                    {event.waitlist_capacity}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Availability:</strong>{" "}
                    {event.availability === "available" ? (
                      <span className="text-green-500 font-medium">
                        Available
                      </span>
                    ) : (
                      <span className="text-red-500 font-medium">
                        Unavailable
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
