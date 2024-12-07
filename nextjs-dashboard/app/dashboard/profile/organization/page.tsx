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
  GlobeAltIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

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

  if (login.type !== "organization") {
      return null; // Render nothing if the user is not of type 'user'
  }

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [currentEvents, setCurrentEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizationInfo = async () => {
      try {
        const organizationId = '9617c140-643d-495d-b3e5-4e0645dfedd5'; // Your test org_ID
        
        // Fetch organization details
        const orgResponse = await fetch(`/api/profile/organization?organizationId=${organizationId}`);
        if (!orgResponse.ok) {
          throw new Error('Failed to fetch organization details');
        }
        const orgData = await orgResponse.json();
        setOrganization(orgData.organization);
  
        // Fetch events
        const eventsResponse = await fetch(`/api/profile/organization/hosted-events?organizationId=${organizationId}`);
        if (!eventsResponse.ok) {
          throw new Error('Failed to fetch events');
        }
        const eventsData = await eventsResponse.json();
        
        // Sort events into current and past based on date
        const now = new Date();
        const sortedEvents = eventsData.hostedEvents.reduce((acc: { current: Event[], past: Event[] }, event: Event) => {
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
  
    fetchOrganizationInfo();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

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
        {category}
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

  // Render page with org info
  return (
    <main className="flex min-h-screen flex-col p-6">
      
        {/* Profile Column */}
        {organization && (
          <div className='w-full flex items-center justify-center'>
            <div className="bg-white rounded-lg shadow-md p-6 w-1/2">
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-8">{organization.name}</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="text-gray-400 w-5 h-5" />
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

      <div>

        {/* Hosted Events Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Events You're Hosting</h2>
          {currentEvents.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {currentEvents.map(event => (
                <EventCard key={event.event_id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-gray-500 rounded-lg p-8 text-center">
              <p>You don't have any upcoming events. Ready to host something new?</p>
            </div>
          )}
        </div>

        {/* Hosted Events History Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Events You've Hosted</h2>
          {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {pastEvents.map(event => (
                <EventCard key={event.event_id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-gray-500 rounded-lg p-8 text-center">
              <p>You haven't hosted any events yet. Your event history will appear here.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

