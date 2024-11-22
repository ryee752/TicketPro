"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../ui/button";

export default function CreateEventForm() {
  const [id, setId] = useState("");
  const [timeData, setTimeData] = useState({
    start_time: "",
    end_time: "",
  });
  const [date, setDate] = useState("");
  const [numberInputs, setNumberInputs] = useState({
    capacity: "",
    waitlist_capacity: "",
    price: "",
  });
  const [stringData, setStringData] = useState({
    street: "",
    city: "",
    state: "",
    zipcode: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Example form validation
    if (!id || !timeData.start_time || !timeData.end_time || !date) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      // Simulate form submission (Replace this with actual API logic)
      const eventData = {
        id,
        ...timeData,
        date,
        ...numberInputs,
        ...stringData,
      };

      console.log("Submitted Event Data:", eventData); // Debugging the submitted data

      // Redirect to the event list page
      router.push("/events");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create the event. Please try again.");
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className="mb-3 text-2xl font-bold">Create New Event</h1>
        <div key={"id"} className="mt-4">
          <label
            htmlFor={"id"}
            className="mb-3 block text-xs font-medium text-gray-900"
          >
            {"id".replace("_", " ").toUpperCase()}
          </label>
          <input
            className="block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm placeholder-gray-500"
            id={"id"}
            type="text"
            name={"id"}
            value={id}
            required
            onChange={(e) => setId(e.target.value)}
            placeholder={`Enter ${"id"}`}
          />
        </div>
        {Object.keys(timeData).map((field) => (
          <div key={field} className="mt-4">
            <label
              htmlFor={field}
              className="mb-3 block text-xs font-medium text-gray-900"
            >
              {field.replace("_", " ").toUpperCase()}
            </label>
            <input
              className="block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm placeholder-gray-500"
              id={field}
              type="time"
              name={field}
              value={timeData[field as keyof typeof timeData]}
              required
              onChange={(e) =>
                setTimeData({ ...timeData, [field]: e.target.value })
              }
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}
        <div key={"date"} className="mt-4">
          <label
            htmlFor={"date"}
            className="mb-3 block text-xs font-medium text-gray-900"
          >
            {"date".replace("_", " ").toUpperCase()}
          </label>
          <input
            className="block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm placeholder-gray-500"
            id={"date"}
            type="date"
            name={"date"}
            value={date}
            required
            onChange={(e) => setDate(e.target.value)}
            placeholder={`Enter ${"date"}`}
          />
        </div>
        {Object.keys(numberInputs).map((field) => (
          <div key={field} className="mt-4">
            <label
              htmlFor={field}
              className="mb-3 block text-xs font-medium text-gray-900"
            >
              {field.replace("_", " ").toUpperCase()}
            </label>
            <input
              className="block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm placeholder-gray-500"
              id={field}
              type="number"
              name={field}
              value={numberInputs[field as keyof typeof numberInputs]}
              required
              onChange={(e) =>
                setNumberInputs({ ...numberInputs, [field]: e.target.value })
              }
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}
        {Object.keys(stringData).map((field) => (
          <div key={field} className="mt-4">
            <label
              htmlFor={field}
              className="mb-3 block text-xs font-medium text-gray-900"
            >
              {field.replace("_", " ").toUpperCase()}
            </label>
            <input
              className="block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm placeholder-gray-500"
              id={field}
              // type={}
              name={field}
              value={stringData[field as keyof typeof stringData]}
              required
              onChange={(e) =>
                setStringData({ ...stringData, [field]: e.target.value })
              }
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}
        <Button type="submit" className="mt-4 w-full">
          Create Event
        </Button>
      </div>
    </form>
  );
}
