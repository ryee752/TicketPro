import { lusitana } from '@/app/ui/fonts';
import TicketProLogo from "../../ui/ticketpro-logo";
import PopularEvents from "./components/popular-events";
import UpcomingList from "./components/upcoming-events";
import PopularOrganizations from "./components/popular-organizations";
 
export default async function Page() {
    // const latestInvoices = await fetchLatestInvoices();
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-45">
        <TicketProLogo />
      </div>
      
      {/* For User view only || Move all this to User-display.tsx later*/}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Organization view only */}
      {/* Organization's upcoming events, displaying the ones in progress now and upcoming events 
          show ticket sales, show availability*/}

          {/* NOTE: THis requires for a new folder in the api directory specifically for home page. 
          I gotta make new SQL queries tailored specifically for this purpose. SIMPLY COPYING EVENTLIST WONT WORK */}
      {/* Quick action button to create new event */}
    </main>
  );
}