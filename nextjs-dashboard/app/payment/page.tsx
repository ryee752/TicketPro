'use client';

<<<<<<< Updated upstream
=======
import { useEffect, useState } from 'react';
>>>>>>> Stashed changes
import PaymentForm from './payment_form';
import TicketProLogo from '@/app/ui/ticketpro-logo';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId') || '';
<<<<<<< Updated upstream
  
=======
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    const fetchEventPrice = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}/event_detail`);
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        const data = await response.json();
        setPrice(data.event.price);
      } catch (error) {
        console.error('Error fetching event price:', error);
      }
    };

    if (eventId) {
      fetchEventPrice();
    }
  }, [eventId]);

>>>>>>> Stashed changes
  return (
    <main className="min-h-screen w-full">
      <div className="w-full h-20 bg-blue-500 p-4 md:h-45">
        <TicketProLogo />
      </div>
      <div className="flex items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-[800px]">
          <div className="rounded-lg bg-gray-50 px-6 py-10">
<<<<<<< Updated upstream
            <PaymentForm eventId={eventId} />
=======
            <PaymentForm 
              eventId={eventId} 
              userId={'35917ac3-5619-4514-a74c-73804b6ddcc7'} 
              price={price}
            />
>>>>>>> Stashed changes
          </div>
        </div>
      </div>
    </main>
  );
}
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
