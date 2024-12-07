"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/store";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "Home", href: "/dashboard/home", icon: HomeIcon },
  {
    name: "Profile",
    href: "/dashboard/profile/",
    icon: DocumentDuplicateIcon,
  },
  { name: "Events", href: "/dashboard/events", icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname(); //Get pathname for webpage that user is currently on
  const login = useSelector((state: RootState) => state.currentLogin.value);
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={
              link.name === "Profile"
                ? login.type === "user"
                  ? link.href + "customer"
                  : link.href + "organization"
                : link.href
            }
            className={clsx(
              //Highlight the name of current webpage in blue on dashboard
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
