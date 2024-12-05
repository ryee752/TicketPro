"use client";

import PopularEvents from "../components/popular-events";
import UpcomingList from "../components/upcoming-events";
import PopularOrganizations from "../components/popular-organizations";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/store";

export default function UserDisplay() {
    const login = useSelector((state: RootState) => state.currentLogin.value); //Value used to distinguish if current user is an 'attendee' or 'organization'
    
    if (login.type !== "user") {
        return null; // Render nothing if the user is not of type 'user'
    }
    
    return (
        <main className="bg-gray-100">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
                {/* list current events with many attendees */}    
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-yellow-400 text-white p-2 rounded-xl">
                Trending Events
                </h2>      
            </div>
            <PopularEvents />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* list popular events with upcoming releases */}
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-700 to-rose-500 text-white p-2 rounded-xl">
                Upcoming Events
                </h2>
            </div>
            <UpcomingList />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* list popular organizations */}
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-600 to-lime-400 text-white p-2 rounded-xl">
                Popular Organizations
                </h2>
            </div>
            <PopularOrganizations />
        </main>
    )
}