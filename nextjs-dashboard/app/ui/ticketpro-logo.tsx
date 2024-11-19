import { TicketIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function TicketProLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <TicketIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[44px]">TicketPro</p>
    </div>
  );
}
