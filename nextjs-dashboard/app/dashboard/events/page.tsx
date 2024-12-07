"use client";
import EventList from "./event_list";
import TicketProLogo from "../../ui/ticketpro-logo";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const login = useSelector((state: any) => state.currentLogin.value);
  const router = useRouter();

  useEffect(() => {
    if (login.id == "") {
      router.push("/");
    }
  }, [login, router]);
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-45">
        <TicketProLogo />
      </div>
      <div className="flex grow items-center justify-center bg-gray-100">
        <div className="w-full p-6">
          <EventList />
        </div>
      </div>
    </main>
  );
}
