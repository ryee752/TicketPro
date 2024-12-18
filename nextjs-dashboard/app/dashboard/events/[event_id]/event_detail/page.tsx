import { use } from "react";
import TicketProLogo from "../../../../ui/ticketpro-logo";
import EventDetailPage from "./event_detail";

export default function Page({
  params,
}: {
  params: Promise<{ event_id: string }>;
}) {
  const { event_id } = use(params);
  return (
    <main className="flex min-h-screen flex-col p-6">
      {/* Header with Logo */}
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-45">
        <TicketProLogo />
      </div>

      {/* Event Detail Section */}
      <div className="flex grow items-center justify-center bg-gray-100">
        <div className="w-full p-6">
          <EventDetailPage eventId={event_id} />
        </div>
      </div>
    </main>
  );
}
