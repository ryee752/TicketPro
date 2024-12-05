"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../ui/button";

export default function CreateEventForm() {
  const [title, setTitle] = useState("");
  const [timeData, setTimeData] = useState({
    start_time: "",
    end_time: "",
  });
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
  const [eventType, setEventType] = useState("");
  const [description, setDescription] = useState(""); // New state for description
  const [image, setImage] = useState<File | null>(null); // New state for image

  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("start_time", timeData.start_time);
    formData.append("end_time", timeData.end_time);
    formData.append("capacity", numberInputs.capacity);
    formData.append("waitlist_capacity", numberInputs.waitlist_capacity);
    formData.append("price", numberInputs.price);
    formData.append("street", stringData.street);
    formData.append("city", stringData.city);
    formData.append("state", stringData.state);
    formData.append("zipcode", stringData.zipcode);
    formData.append("type", eventType);
    formData.append("description", description);

    if (image) {
      formData.append("image", image); // Attach the image file
    }

    const response = await fetch("/api/events/create_event", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      console.log("Event created successfully");
      router.push("/events");
    } else {
      console.error("Failed to create event");
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="flex flex-col md:flex-row gap-6 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        {/* Left Column: Image Upload and Description */}
        <div className="flex-1">
          <h1 className="mb-3 text-2xl font-bold">Create New Event</h1>
          <div className="mt-4">
            <label
              htmlFor="image_url"
              className="mb-3 block text-xs font-medium text-gray-900"
            >
              EVENT IMAGE
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
            />
            {/* Preview the image if the URL is valid */}
            {image && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Event Preview"
                  className="rounded-md w-full max-h-100 object-contain"
                  onError={(e) => (e.currentTarget.style.display = "none")} // Hide preview if the URL is invalid
                />
              </div>
            )}
          </div>
          <div className="mt-4">
            <label
              htmlFor="description"
              className="mb-3 block text-xs font-medium text-gray-900"
            >
              EVENT DESCRIPTION
            </label>
            <textarea
              className="block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm"
              id="description"
              name="description"
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description"
              rows={5}
            ></textarea>
          </div>
        </div>

        {/* Right Column: Other Inputs */}
        <div className="flex-1">
          <div className="mt-4">
            <label
              htmlFor="title"
              className="mb-3 block text-xs font-medium text-gray-900"
            >
              EVENT TITLE
            </label>
            <input
              className="block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm"
              id="title"
              type="text"
              name="title"
              value={title}
              maxLength={50}
              required
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title (max 50 characters)"
            />
          </div>
          {/* Time inputs */}
          {Object.keys(timeData).map((field) => (
            <div key={field} className="mt-4">
              <label
                htmlFor={field}
                className="mb-3 block text-xs font-medium text-gray-900"
              >
                {field.replace("_", " ").toUpperCase()}
              </label>
              <input
                className="block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm"
                id={field}
                type="datetime-local"
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

          {/* Number inputs */}
          {Object.keys(numberInputs).map((field) => (
            <div key={field} className="mt-4">
              <label
                htmlFor={field}
                className="mb-3 block text-xs font-medium text-gray-900"
              >
                {field.replace("_", " ").toUpperCase()}
              </label>
              <input
                className="block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm"
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

          {/* String inputs */}
          {Object.keys(stringData).map((field) => (
            <div key={field} className="mt-4">
              <label
                htmlFor={field}
                className="mb-3 block text-xs font-medium text-gray-900"
              >
                {field.replace("_", " ").toUpperCase()}
              </label>
              <input
                className="block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm"
                id={field}
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

          {/* Dropdown for Event Type */}
          <div className="mt-4">
            <label
              htmlFor="eventType"
              className="mb-3 block text-xs font-medium text-gray-900"
            >
              EVENT TYPE
            </label>
            <select
              className="block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm"
              id="eventType"
              name="eventType"
              value={eventType}
              required
              onChange={(e) => setEventType(e.target.value)}
            >
              <option value="" disabled>
                Select Event Type
              </option>
              <option value="Concert">Concert</option>
              <option value="Webinar">Webinar</option>
              <option value="Conference">Conference</option>
              <option value="Workshop">Workshop</option>
              <option value="Community Gathering">Community Gathering</option>
            </select>
          </div>
        </div>
      </div>
      <Button type="submit" className="mt-4 w-full">
        Create Event
      </Button>
    </form>
  );
}
