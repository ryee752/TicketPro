"use client";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import TicketProLogo from "./ui/ticketpro-logo";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./lib/store";
import { reset } from "./lib/feature/currentLogin";

const imageMatch = [
  {
    eventId: "e872ef08-d289-4324-997e-fb5588f275fb",
    imagePath: "./app/data/webinar/1.avif",
  },
  {
    eventId: "k345ef12-1a34-4c45-bc12-1ddef1234567",
    imagePath: "./app/data/webinar/2.avif",
  },
  {
    eventId: "a672ef12-1c23-4b45-b123-1cdef4567890",
    imagePath: "./app/data/webinar/3.avif",
  },
  {
    eventId: "o890ij67-4e78-8f90-fg67-5hij56789012",
    imagePath: "./app/data/webinar/4.jpg",
  },
  {
    eventId: "o345fg78-2345-6789-klmn-01234567fghi",
    imagePath: "./app/data/webinar/5.jpg",
  },
  {
    eventId: "v567pq34-bl45-5678-mn34-2opq23456789",
    imagePath: "./app/data/webinar/6.avif",
  },
  {
    eventId: "k987bd34-8901-2345-ghij-67890123bcde",
    imagePath: "./app/data/webinar/7.jpg",
  },
  {
    eventId: "f876bc90-3456-7890-cdef-1234567890ab",
    imagePath: "./app/data/webinar/8.jpg",
  },
  {
    eventId: "z901tu78-fo89-9012-qr78-6stu67890123",
    imagePath: "./app/data/webinar/9.jpg",
  },
  {
    eventId: "d456yz12-jk34-4567-uv12-0yz012345678",
    imagePath: "./app/data/webinar/10.avif",
  },
  {
    eventId: "fc56b998-a4d1-4b0f-a5b8-f4e1ac8a872b",
    imagePath: "./app/data/workshop/1.jpg",
  },
  {
    eventId: "t345no12-9j23-3456-kl12-0mno01234567",
    imagePath: "./app/data/workshop/2.jpg",
  },
  {
    eventId: "d456af98-ef12-456b-b123-abcdef123456",
    imagePath: "./app/data/workshop/3.jpg",
  },
  {
    eventId: "l098ce45-9012-3456-hijk-78901234cdef",
    imagePath: "./app/data/workshop/4.jpg",
  },
  {
    eventId: "p456gh89-3456-7890-lmno-12345678ghij",
    imagePath: "./app/data/workshop/5.jpg",
  },
  {
    eventId: "e423ac98-2345-6789-bcde-f1234567890a",
    imagePath: "./app/data/workshop/6.jpg",
  },
  {
    eventId: "p901jk78-5f89-9012-gh78-6ijk67890123",
    imagePath: "./app/data/workshop/7.jpg",
  },
  {
    eventId: "m678gh45-2c56-6d78-de45-3fgh34567890",
    imagePath: "./app/data/workshop/8.jpg",
  },
  {
    eventId: "x789rs56-dn67-7890-op56-4qrs45678901",
    imagePath: "./app/data/workshop/9.jpg",
  },
  {
    eventId: "i876fc56-6789-0123-dfgh-45678901abcd",
    imagePath: "./app/data/workshop/10.jpg",
  },
  {
    eventId: "a123vw89-gh01-1234-rs89-7uvw78901234",
    imagePath: "./app/data/workshop/11.jpg",
  },
  {
    eventId: "e567za23-kl45-5678-vw23-1za123456789",
    imagePath: "./app/data/workshop/12.jpg",
  },
  {
    eventId: "b123f33d-54da-41bb-9a43-dc1234f34cc7",
    imagePath: "./app/data/concert/1.jpg",
  },
  {
    eventId: "n789hi56-3d67-7e89-ef56-4ghi45678901",
    imagePath: "./app/data/concert/2.jpg",
  },
  {
    eventId: "d452gf34-1234-5678-abcd-ef34567890ab",
    imagePath: "./app/data/concert/3.jpg",
  },
  {
    eventId: "u456op23-ak34-4567-lm23-1nop12345678",
    imagePath: "./app/data/concert/4.avif",
  },
  {
    eventId: "n234ef67-1234-5678-jklm-90123456efgh",
    imagePath: "./app/data/concert/5.avif",
  },
  {
    eventId: "j876ac12-7890-1234-dfgh-56789012abcd",
    imagePath: "./app/data/concert/6.avif",
  },
  {
    eventId: "q012kl89-6g90-0123-hi89-7jkl78901234",
    imagePath: "./app/data/concert/7.avif",
  },
  {
    eventId: "y890st67-en78-8901-pq67-5rst56789012",
    imagePath: "./app/data/concert/8.jpg",
  },
  {
    eventId: "g876dc34-4567-8901-cdef-234567890abc",
    imagePath: "./app/data/concert/9.jpg",
  },
  {
    eventId: "c345xy01-ij23-3456-tu01-9xyz90123456",
    imagePath: "./app/data/concert/10.avif",
  },
  {
    eventId: "b234wx90-hi12-2345-st90-8wxy89012345",
    imagePath: "./app/data/conference/1.webp",
  },
  {
    eventId: "l567fg34-1b45-5c67-cd34-2edef2345678",
    imagePath: "./app/data/conference/2.webp",
  },
  {
    eventId: "m123df56-0123-4567-ijkl-89012345defg",
    imagePath: "./app/data/conference/3.webp",
  },
  {
    eventId: "c672bc98-1d23-4567-bc89-2def12345678",
    imagePath: "./app/data/conference/4.webp",
  },
  {
    eventId: "h876ec45-5678-9012-dfgh-34567890abcd",
    imagePath: "./app/data/conference/5.webp",
  },
  {
    eventId: "w678qr45-cm56-6789-no45-3pqr34567890",
    imagePath: "./app/data/conference/6.webp",
  },
  {
    eventId: "r123lm90-7h01-1234-ij90-8klm89012345",
    imagePath: "./app/data/conference/7.webp",
  },
  {
    eventId: "e56af44c-cd5c-4b15-b923-98c4826bb6c6",
    imagePath: "./app/data/conference/8.webp",
  },
];

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentLogin = useSelector(
    (state: RootState) => state.currentLogin.value
  );

  async function updateImageForEvent(eventId: string, imagePath: string) {
    try {
      const response = await fetch("/api/events/update_image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, imagePath }),
      });

      if (!response.ok) {
        console.error(`Failed to update image for eventId: ${eventId}`);
        return;
      }

      const data = await response.json();
      console.log(`Successfully updated image for eventId: ${eventId}`, data);
    } catch (error) {
      console.error(`Error updating image for eventId: ${eventId}`, error);
    }
  }

  async function imageForEvents() {
    for (const { eventId, imagePath } of imageMatch) {
      await updateImageForEvent(eventId, imagePath);
    }
  }

  // useEffect(() => {
  //   imageForEvents();
  // }, []);

  // useEffect(() => {
  //   const handleUnload = () => {
  //     dispatch(reset()); // Reset Redux state
  //   };

  //   window.addEventListener("unload", handleUnload);
  //   return () => window.removeEventListener("unload", handleUnload);
  // }, [dispatch]);

  useEffect(() => {
    if (currentLogin.id !== "") {
      router.push("/dashboard/home");
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
