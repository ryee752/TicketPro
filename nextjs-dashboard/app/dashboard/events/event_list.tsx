"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/store";

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
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]); // For filtered events
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    location: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    genre: "",
    speaker_name: "",
    instructor_name: "",
    topic: "",
  });
  const [loading, setLoading] = useState(false);
  const login = useSelector((state: RootState) => state.currentLogin.value);

  const fetchEvents = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        search: searchQuery || "",
        location: filters.location || "",
        category: filters.category || "",
        minPrice: filters.minPrice || "0",
        maxPrice: filters.maxPrice || "9999999",
        genre: filters.genre || "",
        speaker_name: filters.speaker_name || "",
        instructor_name: filters.instructor_name || "",
        topic: filters.topic || "",
      });

      const response = await fetch(`/api/events?${params.toString()}`);
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
  }, [
    filters.location,
    filters.category,
    filters.maxPrice,
    filters.minPrice,
    filters.genre,
    filters.speaker_name,
    filters.instructor_name,
    filters.topic,
    searchQuery,
  ]);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  // Handle filters
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="relative flex items-center justify-between bg-blue-500 p-4 text-white">
        <h1 className="text-xl font-bold">Event List</h1>
        {login.type === "organization" ? (
          <Link
            href="/dashboard/events/create_event"
            className="absolute right-4 bg-white text-blue-500 px-4 py-2 rounded-lg font-medium shadow-md hover:bg-gray-200"
          >
            Create Event
          </Link>
        ) : null}
      </div>

      {/* Filters */}
      <div className="p-6 bg-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by title..."
            className="w-full md:w-1/3 border border-gray-300 rounded-lg p-2"
          />
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Filter by location..."
            className="w-full md:w-1/3 border border-gray-300 rounded-lg p-2"
          />
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full md:w-1/3 border border-gray-300 rounded-lg p-2"
          >
            <option value="">All Categories</option>
            <option value="Concert">Concert</option>
            <option value="Webinar">Webinar</option>
            <option value="Conference">Conference</option>
            <option value="Workshop">Workshop</option>
          </select>
          <div className="flex gap-2">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Min Price"
              className="w-full md:w-1/3 border border-gray-300 rounded-lg p-2"
            />
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Max Price"
              className="w-full md:w-1/3 border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>

        {/* Dynamic Inputs */}
        {filters.category === "Concert" && (
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-900">
              Genre
            </label>
            <input
              type="text"
              name="genre"
              value={filters.genre}
              onChange={handleFilterChange}
              placeholder="Filter by genre..."
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
        )}
        {filters.category === "Conference" && (
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-900">
              Speaker Name
            </label>
            <input
              type="text"
              name="speaker_name"
              value={filters.speaker_name}
              onChange={handleFilterChange}
              placeholder="Filter by speaker name..."
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
        )}
        {filters.category === "Workshop" && (
          <>
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-900">
                Instructor Name
              </label>
              <input
                type="text"
                name="instructor_name"
                value={filters.instructor_name}
                onChange={handleFilterChange}
                placeholder="Filter by instructor name..."
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-900">
                Topic
              </label>
              <input
                type="text"
                name="topic"
                value={filters.topic}
                onChange={handleFilterChange}
                placeholder="Filter by topic..."
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          </>
        )}
      </div>

      {/* Event Cards */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          let image = null;
          if (event.image) {
            image = Buffer.from(event.image).toString("base64");
          }
          return (
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
          );
        })}
      </div>

      {loading && <p className="text-center mt-4">Loading more events...</p>}
      {!hasMore && filteredEvents.length === 0 && (
        <p className="text-center mt-4">No events found.</p>
      )}
    </main>
  );
}
