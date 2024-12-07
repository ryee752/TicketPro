"use client";

import { useEffect, useState } from "react";
import PaymentForm from "./payment_form";
import TicketProLogo from "@/app/ui/ticketpro-logo";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/store";

export default function PaymentWrapper() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId") || "";
  const [price, setPrice] = useState<number>(0);

  const currentUser = useSelector(
    (state: RootState) => state.currentLogin.value
  );

  useEffect(() => {
    if (!eventId) return;

    const fetchEventPrice = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}/event_detail`);
        if (!response.ok) throw new Error("Failed to fetch event details.");

        const data = await response.json();
        setPrice(data.event.price || 0);
      } catch (error) {
        console.error("Error fetching event price:", error);
      }
    };

    fetchEventPrice();
  }, [eventId]);

  if (!eventId) {
    return (
      <main className="text-center py-10">
        <p className="text-red-500">Invalid or missing event ID.</p>
      </main>
    );
  }

  if (!currentUser?.id) {
    return (
      <main className="text-center py-10">
        <p className="text-red-500">
          Please log in to proceed with the payment.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full">
      <div className="w-full h-20 bg-blue-500 p-4 md:h-45">
        <TicketProLogo />
      </div>
      <div className="flex items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-[800px]">
          <div className="rounded-lg bg-gray-50 px-6 py-10">
            <PaymentForm
              eventId={eventId}
              userId={currentUser.id}
              price={price}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
