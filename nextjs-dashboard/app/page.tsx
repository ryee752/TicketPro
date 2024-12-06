"use client";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import TicketProLogo from "./ui/ticketpro-logo";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./lib/store";
import { reset } from "./lib/feature/currentLogin";

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentLogin = useSelector(
    (state: RootState) => state.currentLogin.value
  );
  useEffect(() => {
    const handleUnload = () => {
      dispatch(reset()); // Reset Redux state
    };

    window.addEventListener("unload", handleUnload);
    return () => window.removeEventListener("unload", handleUnload);
  }, [dispatch]);
  useEffect(() => {
    if (currentLogin !== -1) {
      router.push("../../events");
    }
  }, [currentLogin, router]);

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-45">
        <TicketProLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Welcome to TicketPro.</strong> The platform to get your
            tickets.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
        </div>
      </div>
    </main>
  );
}
