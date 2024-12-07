"use client";
import TicketProLogo from "../../ui/ticketpro-logo";
import UserDisplay from "./user/user-display";
import OrganizationDisplay from "./organization/organization-display";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function Page() {
  const dispatch = useDispatch();

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

      {/* This displays the user's home page item if currently signed in user is a "user" type*/}
      <UserDisplay />

      {/* This displays the organization's home page item if currently signed in user is a "organization" type*/}
      <OrganizationDisplay />

      {/* Organization view only */}
      {/* Organization's upcoming events, displaying the ones in progress now and upcoming events 
          show ticket sales, show availability*/}

      {/* NOTE: THis requires for a new folder in the api directory specifically for home page. 
          I gotta make new SQL queries tailored specifically for this purpose. SIMPLY COPYING EVENTLIST WONT WORK */}
      {/* Quick action button to create new event */}
    </main>
  );
}
