/* This component displays upcoming events for attendees (regular users) & organizations. 
    If the current logged in user is an attendee:
     - the attendee's next 5 upcoming events in their event-list will be displayed. 
     - Events before the current date/time will not be displayed

    If the current logged in user is an organization:
     - the organization's next 5 upcoming events the org is hosting will be displayed
*/

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/store";

type Organization = {
  org_id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  event_count: number;
};

export default function EventList() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const login = useSelector((state: RootState) => state.currentLogin.value); //Value used to distinguish if current user is an 'attendee' or 'organization'

  const fetchOrganizations = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/home/user/popular-organizations`); //No need to pass parameters for this query
      
      if (!response.ok) throw new Error("Failed to fetch organizations");

      const data = await response.json();
      const newOrganizations = Array.isArray(data) ? data : data.organizations || [];
      setOrganizations(newOrganizations);
      setHasMore(newOrganizations.length > 0);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations(); // Fetch organizations on mount
  }, []);

  return (
    <main className="bg-gray-100">
      {/* Event Cards */}
      <div className="p-3 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-5 gap-6">
        {organizations.map((organization) => {
          {return (
            <Link
              key={organization.org_id}
              href={`/dashboard`}
            >
              <div
                key={organization.org_id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >

                {/* Organization Details */}
                <div className="p-4">
                  <h2 className="text-lg font-bold">{organization.name}</h2>
                  <p className="text-sm text-gray-600">
                    {organization.city}, {organization.state}
                  </p>
                  <span className={`inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-800`}>
                      Number of Events: {organization.event_count}
                  </span>
                </div>
              </div>
            </Link>
          );}
        })}
      </div>

      {loading && <p className="text-center mt-4">Loading more events...</p>}
      {!hasMore && (
        <p className="text-center mt-4">No events found.</p>
      )}
    </main>
  );
}
