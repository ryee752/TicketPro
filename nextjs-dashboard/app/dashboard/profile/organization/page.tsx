"use client";

import { useState, useEffect } from "react";
import TicketProLogo from "../../../ui/ticketpro-logo";
import React from "react";
import {
  UserIcon,
  MapPinIcon,
  CalendarIcon,
  TagIcon,
  EnvelopeIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/store";
import { useRouter } from "next/navigation";

// Interface for organization details (matching backend schema)
interface Organization {
  org_ID: string;
  name: string;
  email: string;
  phone: string;
  website: string | null;
  street: string;
  city: string;
  state: string;
  zipcode: number;
  full_address: string;
}

// Types for events (matching backend schema)
interface Event {
  id: number;
  title: string;
  imageUrl: string;
  location: string;
  dateTime: string;
  category: "concerts" | "webinars" | "conferences" | "workshops" | "community";
}

export default function Page() {
  const login = useSelector((state: RootState) => state.currentLogin.value);
  const [organization, setOrganization] = useState<Organization | null>(null);
  //const [currentEvents, setCurrentEvents] = useState<Event[]>([]);
  //const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (login.id == "") {
      router.push("/");
    }
  }, [login, router]);

  useEffect(() => {
    const fetchOrganizationInfo = async () => {
      try {
        // Fetch organization details
        const orgResponse = await fetch(
          `/api/profile/organization?organizationId=${login.id}`
        );

        if (!orgResponse.ok) {
          throw new Error("Failed to fetch organization details");
        }
        const orgData = await orgResponse.json();
        setOrganization(orgData.organization);

        // Fetch events
        // const eventsResponse = await fetch(`/api/events?organizationId=${organizationId}`);
        // if (!eventsResponse.ok) {
        //   throw new Error('Failed to fetch events');
        // }
        // const eventsData = await eventsResponse.json();
        // setCurrentEvents(eventsData.currentEvents || []);
        // setPastEvents(eventsData.pastEvents || []);

        setIsLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setIsLoading(false);
      }
    };

    fetchOrganizationInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  // Sample events data
  const hostedEvents: Event[] = [
    {
      id: 1,
      title: "Web Development Workshop",
      imageUrl: "https://tinyurl.com/3a2apeef",
      location: "Innovation Hub",
      dateTime: "2024-12-10 02:00 PM",
      category: "workshops",
    },
    {
      id: 2,
      title: "Local Music Festival",
      imageUrl: "https://tinyurl.com/5cu5nvs8",
      location: "City Park",
      dateTime: "2024-12-20 07:00 PM",
      category: "concerts",
    },
  ];

  const hostedEventsHistory: Event[] = [
    {
      id: 1,
      title: "Web Development Workshop",
      imageUrl: "https://tinyurl.com/3a2apeef",
      location: "Innovation Hub",
      dateTime: "2024-12-10 02:00 PM",
      category: "workshops",
    },
    {
      id: 2,
      title: "Local Music Festival",
      imageUrl: "https://tinyurl.com/5cu5nvs8",
      location: "City Park",
      dateTime: "2024-12-20 07:00 PM",
      category: "concerts",
    },
    {
      id: 3,
      title: "Tech Conference 2024",
      imageUrl: "https://tinyurl.com/mb8h63y7",
      location: "Convention Center",
      dateTime: "2024-12-15 09:00 AM",
      category: "conferences",
    },
    {
      id: 4,
      title: "Web Development Workshop",
      imageUrl: "https://tinyurl.com/3a2apeef",
      location: "Innovation Hub",
      dateTime: "2024-12-10 02:00 PM",
      category: "workshops",
    },
    {
      id: 5,
      title: "Local Music Festival",
      imageUrl: "https://tinyurl.com/5cu5nvs8",
      location: "City Park",
      dateTime: "2024-12-20 07:00 PM",
      category: "concerts",
    },
    {
      id: 6,
      title: "Tech Conference 2024",
      imageUrl: "https://tinyurl.com/mb8h63y7",
      location: "Convention Center",
      dateTime: "2024-12-15 09:00 AM",
      category: "conferences",
    },
  ];

  // Function to render category badge
  const CategoryBadge = ({ category }: { category: Event["category"] }) => {
    const colors = {
      concerts: "bg-purple-100 text-purple-800",
      webinars: "bg-blue-100 text-blue-800",
      conferences: "bg-green-100 text-green-800",
      workshops: "bg-orange-100 text-orange-800",
      community: "bg-pink-100 text-pink-800",
    };

    return (
      <span className={`px-2 py-1 rounded-full text-sm ${colors[category]}`}>
        {category}
      </span>
    );
  };

  // Function to render event card
  const EventCard = ({ event }: { event: Event }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="w-3 h-3" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-3 h-3" />
              <span>{event.dateTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <TagIcon className="w-3 h-3" />
              <CategoryBadge category={event.category} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render page with org info
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-45">
        <div className="flex items-center text-white">
          <TicketProLogo />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Left Column - Profile */}
        {organization && (
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-4">
                  {organization.name}
                </h2>
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-3">
                    <UserIcon className="text-gray-400 w-5 h-5" />
                    <span>{organization.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="text-gray-400 w-5 h-5" />
                    <span>{organization.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Column - Events */}
        <div className="md:col-span-8 space-y-6">
          {/* Hosted Events Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Events You're Hosting
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {hostedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-12 space-y-6">
          {/* Hosted Events History Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Events You've Hosted
            </h2>
            {/* <div className="h-96 overflow-y-auto"> */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {hostedEventsHistory.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>
    </main>
  );
}
