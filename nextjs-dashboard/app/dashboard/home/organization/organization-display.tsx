/* This is the component used to display items that only organizations should be able to see. Regular users cannot see items displayed in this page */

"use client";

import InProgressEvents from "../components/in-progress-events";
import UpcomingList from "../components/upcoming-events";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/store";

export default function UserDisplay() {
    const login = useSelector((state: RootState) => state.currentLogin.value); //Value used to distinguish if current user is an 'attendee' or 'organization'
    
    if (login.type !== "organization") {
        return null; // Render nothing if the user is not of type 'user'
    }
    
    return (
        <main className="bg-gray-100">
             <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
                {/* list current events with many attendees */}    
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-yellow-400 text-white p-2 rounded-xl">
                In-progress Events
                </h2>      
            </div>
            <InProgressEvents />
             
             <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
                {/* list popular events with upcoming releases */}
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-700 to-rose-500 text-white p-2 rounded-xl">
                Upcoming Events
                </h2>
            </div>
            <UpcomingList />
        </main>
    )
}