'use client';

import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/store";
import React from 'react';
import { 
  MapPinIcon, 
  CalendarIcon, 
  TagIcon, 
  EnvelopeIcon,
  TicketIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

// Interface for user details
interface User {
  user_ID: string;
  name: string;
  phone: string;
  email: string;
}

// Types for events (matching backend schema)
interface Event {
  event_id: string;
  org_id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  capacity: number;
  waitlist_capacity: number;
  price: number;
  availability: 'available' | 'unavailable';
  street: string;
  city: string;
  state: string;
  zipcode: number;
  type: 'Concert' | 'Webinar' | 'Conference' | 'Workshop';
  image: Buffer; 
  description: string;
}

export default function Page() {
  const login = useSelector((state: RootState) => state.currentLogin.value); //Value used to distinguish if current user is an 'attendee' or 'organization'

  if (login.type !== "user") {
      return null; // Render nothing if the user is not of type 'user'
  }

  // State to store fetched data
  const [user, setUser] = useState<User | null>(null);
  const [currentEvents, setCurrentEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events when component mounts
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Replace with the actual user ID (you might get this from authentication)
        const userId = '102a3ef7-359b-4f42-94d6-4ec5e1936b16'; // This should come from your auth system
        
        const response = await fetch(`/api/profile/customer?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user information');
        }

        const data = await response.json();
        setUser(data.user);

         // Fetch events
         const eventsResponse = await fetch(`/api/profile/customer/attended-events?userId=${userId}`);
         if (!eventsResponse.ok) {
           throw new Error('Failed to fetch events');
         }
         const eventsData = await eventsResponse.json();

         // Sort events into current and past based on date
        const now = new Date();
        const sortedEvents = eventsData.attendedEvents.reduce((acc: { current: Event[], past: Event[] }, event: Event) => {
          const eventDate = new Date(event.date);
          if (eventDate >= now) {
            acc.current.push(event);
          } else {
            acc.past.push(event);
          }
          return acc;
        }, { current: [], past: [] });
  
        setCurrentEvents(sortedEvents.current);
        setPastEvents(sortedEvents.past);
        setIsLoading(false);

      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // Loading state
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Error state
  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  // Function to render category badge
  const CategoryBadge = ({ category }: { category: Event['type'] }) => {
    const colors = {
      Concert: 'bg-purple-100 text-purple-800',
      Webinar: 'bg-blue-100 text-blue-800',
      Conference: 'bg-green-100 text-green-800',
      Workshop: 'bg-orange-100 text-orange-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-sm ${colors[category]}`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  // Function to render event card
  const EventCard = ({ event }: { event: Event }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
        {/* Use a default placeholder image if event.image is not available */}
        <img 
          src={`data:image/jpeg;base64,${Buffer.from(event.image).toString('base64')}`}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-3 h-3"/>
              <span>{`${event.street}, ${event.city}, ${event.state} ${event.zipcode}`}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-3 h-3"/>
              <span>
                {`${new Date(event.date).toLocaleDateString()} `}
                {event.startTime && event.endTime ? 
                  `${event.startTime}-${event.endTime}` : 
                  'Time TBD'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TagIcon className="w-3 h-3"/>
              <CategoryBadge category={event.type} />
            </div>
            {event.price > 0 && (
              <div className="mt-2">
                <span className="font-semibold">${event.price}</span>
              </div>
            )}
            {event.description && (
              <p className="text-sm text-gray-500 mt-2">{event.description}</p>
            )}
          </div>
        </div>
      </div>
    );
  };


  // Render page with user info
  return (
    <main className="flex min-h-screen flex-col p-6">

        {/* Profile Column */}
        {user && (
          <div className='w-full flex items-center justify-center'>
            <div className="bg-white rounded-lg shadow-md p-6 w-1/2">
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-8">{user.name}</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="text-gray-400 w-5 h-5" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="text-gray-400 w-5 h-5" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      <div>
      
      {/* Attended Events Section */}
      <div>
          <h2 className="text-2xl font-semibold mb-4">Events You're Attending</h2>
          {currentEvents.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {currentEvents.map(event => (
                <EventCard key={event.event_id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-gray-500 rounded-lg p-8 text-center">
              <p>You haven't registered for any events. Ready to register?</p>
            </div>
          )}
        </div>

        {/* Attended Events History Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Events You've Attended</h2>
          {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {pastEvents.map(event => (
                <EventCard key={event.event_id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-gray-500 rounded-lg p-8 text-center">
              <p>You haven't attended any events yet. Your attendence history will appear here.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}