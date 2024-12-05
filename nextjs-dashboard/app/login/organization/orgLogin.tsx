"use client";
import { lusitana } from "../../ui/fonts";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "../../ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { storeLoginInfo } from "@/app/lib/feature/currentLogin";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();


  const currentLogin = useSelector((state: any) => state.currentLogin.value);
  // console.log("ID:" + currentLogin.value);
  // Redirect if already logged in
  useEffect(() => {
    if (currentLogin !== -1) {
      router.push("../../events");
    }
  }, [currentLogin, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Simple validation
    if (!email || !password) {
      setFormError("Please fill in all fields.");
      return;
    }

    // If validation passes, redirect to the dashboard
    setFormError(""); // Clear any previous errors
    const response = await fetch("../../api/login/organization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // The request was successful
      const result = await response.json(); // If the server returns JSON data
      dispatch(
        storeLoginInfo({
          id: result.user.id,
          type: "organization",
        })
      ); // Process the result
      router.push("../events");
    } else {
      // The request failed
      console.error("Login failed");
      alert("Invalid User, please try again");
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className="w-full">
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
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
            Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
        </div>

        <div className="mt-4">
          <Link href="/signup">
            <span className="text-blue-600">
              Don't have an account? Sign up here
            </span>{" "}
            <ArrowRightIcon className="w-5 md:w-6 inline" />
          </Link>
        </div>
      </div>
    </form>
  );
}
