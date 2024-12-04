'use client';

import PaymentForm from './payment_form';
import TicketProLogo from '@/app/ui/ticketpro-logo';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId') || '';
  
  return (
    <main className="min-h-screen w-full">
      <div className="w-full h-20 bg-blue-500 p-4 md:h-45">
        <TicketProLogo />
      </div>
      <div className="flex items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-[800px]">
          <div className="rounded-lg bg-gray-50 px-6 py-10">
            <PaymentForm eventId={eventId} />
          </div>
        </div>
      </div>
    </main>
  );
}

