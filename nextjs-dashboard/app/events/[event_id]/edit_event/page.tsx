import AcmeLogo from "@/app/ui/ticketpro-logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import EditEventForm from "./edit_event";
import TicketProLogo from "../../../ui/ticketpro-logo";

export default async function Page({
  params,
}: {
  params: { event_id: string };
}) {
  const { event_id } = await params;
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-45">
        <TicketProLogo />
      </div>
      <div className="flex grow items-center justify-center bg-gray-100">
        <div className="w-full p-6">
          <EditEventForm eventId={event_id} />
        </div>
      </div>
    </main>
  );
}
