"use client";
import { lusitana } from "../../ui/fonts";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  PencilSquareIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "../../ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { storeLoginInfo } from "@/app/lib/feature/currentLogin";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const currentLogin = useSelector((state: any) => state.currentLogin.value);

  // Redirect if already logged in
  useEffect(() => {
    if (currentLogin.id !== "") {
      router.push("../../dashboard/home");
    }
  }, [currentLogin, router]);

  const handleGoBack = () => {
    router.back(); // Navigate to the previous page in history
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Simple validation
    if (!email || !password || !first || !last || !phone) {
      setFormError("Please fill in all fields.");
      return;
    }

    setFormError(""); // Clear any previous errors

    //Inserting data
    const response = await fetch("../../api/signup/customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first, last, phone, email, password }),
    });

    if (response.ok) {
      console.log("User Registered");
      // The request was successful
      const result = await response.json(); // If the server returns JSON data
      dispatch(
        storeLoginInfo({
          id: result.user.id,
          type: "user",
        })
      ); // Process the result
      router.push("../../dashboard/home");
    } else {
      // The request failed
      const err = await response.json();
      alert(err.error);
      console.log("Registration failed");
    }
  };

  // const checkExisting = async () => {
  //   const response = await fetch(`../../api/signup/customer?${encodeURIComponent(email)}`, {
  //     method: 'GET',
  //     headers: { 'Content-Type': 'application/json' },
  //   });

  //   if (response.ok) {
  //     // The request was successful
  //     const result = await response.json(); // If the server returns JSON data
  //     console.log(result); // Process the result
  //   } else {
  //     // The request failed
  //     console.error('Email Taken');
  //   }
  // }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please fill in the following fields to sign up.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="first_name"
            >
              First Name
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="first_name"
                type="first_name"
                name="first_name"
                placeholder="Enter your First Name"
                maxLength={50}
                required
                value={first}
                onChange={(e) => setFirst(e.target.value)}
              />
              <PencilSquareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="last_name"
            >
              Last Name
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="last_name"
                type="last_name"
                name="last_name"
                placeholder="Enter your Last Name"
                maxLength={50}
                required
                value={last}
                onChange={(e) => setLast(e.target.value)}
              />
              <PencilSquareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="phone"
                type="phone"
                name="phone"
                placeholder="Enter your phone number, eg.123-456-7890"
                pattern="^\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}$"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          {formError && (
            <div className="mt-2 text-sm text-red-600">
              <ExclamationCircleIcon className="inline h-5 w-5 mr-1" />
              {formError}
            </div>
          )}

          <div>
            <Button type="submit" className="mt-4 w-full">
              Sign Up{" "}
              <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
            </Button>
          </div>
          <div>
            <Button className="mt-4 w-full" onClick={handleGoBack}>
              Go Back to Previous Page <ArrowLeftIcon className="ml-auto h-5 w-5 text-gray-50" />
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
