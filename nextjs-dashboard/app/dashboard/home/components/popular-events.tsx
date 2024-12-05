/* This component displays the top 5 trending events to users
    Search criteria for top 5 is based on how many users are attending the event. 
    This can be further optimized to fit user preferences in the future
*/

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/store";

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
  tickets_sold: number;
  spots_left: number;
};

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const login = useSelector((state: RootState) => state.currentLogin.value); //Value used to distinguish if current user is an 'attendee' or 'organization'

  const fetchEvents = async () => {
    setLoading(true);

    try {
      // const params = new URLSearchParams({ //passes parameters to api/home/user/popular-events/route.tsx
      //    user_id: login.id //This should ALWAYS be a user_id not an org_id here. if login.type is organization, there is a problem
      // });
      // const response = await fetch(`/api/home/user/popular-events?${params.toString()}`);
    
      const response = await fetch(`/api/home/organization/popular-events`); //No need to pass parameters for this query
      if (!response.ok) throw new Error("Failed to fetch events");

      const data = await response.json();
      const newEvents = Array.isArray(data) ? data : data.events || [];
      setEvents(newEvents);
      setHasMore(newEvents.length > 0);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(); // Fetch events on mount
  }, []);

  return (
    <main className="bg-gray-100">
      {/* Event Cards */}
      <div className="p-3 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-5 gap-6">
        {events.map((event) => {
          let image = null;
          if (event.image) {
            image = Buffer.from(event.image).toString("base64");
          }
          return ( //When users click on event card, send user to event-details page
            <Link
              key={event.event_id}
              href={`/dashboard/events/${event.event_id}/event_detail`}
            >
              <div
                key={event.event_id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Event Image */}
                {event.image && (
                  <img
                    src={`data:image/jpeg;base64,${image}`} // Convert BLOB to base64
                    alt={event.event_id}
                    className="w-full h-28 object-cover"
                  />
                )}

                {/* Event Details */}
                <div className="p-4">
                  <h2 className="text-lg font-bold">{event.title}</h2>
                  <p className="text-sm text-gray-600">
                    {event.city}, {event.state}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {/* Display # of Tickets sold and how many spots left */}
                    {/* Tickets Sold: {event.tickets_sold}, Spots Left: {event.spots_left}  */}
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
          );
        })}
      </div>

      {loading && <p className="text-center mt-4">Loading more events...</p>}
      {!hasMore && events.length === 0 && (
        <p className="text-center mt-4">No events found.</p>
      )}
    </main>
  );
}
