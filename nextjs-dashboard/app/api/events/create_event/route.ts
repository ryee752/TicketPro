import connection from "../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    // Parse the form data
    const contentType = request.headers.get("content-type");

    if (!contentType || !contentType.startsWith("multipart/form-data")) {
      return NextResponse.json(
        { message: "Invalid content type" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const fields: Record<string, string> = {};
    let imageBuffer: Buffer | null = null;

    // Process form fields and file
    formData.forEach((value, key) => {
      if (key === "image" && value instanceof File) {
        const arrayBufferPromise = value.arrayBuffer();
        arrayBufferPromise.then((arrayBuffer) => {
          imageBuffer = Buffer.from(arrayBuffer);
        });
      } else {
        fields[key] = value.toString();
      }
    });

    // Wait for imageBuffer to be ready
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!imageBuffer) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 }
      );
    }

    // Call the helper function to create the event
    const result: any = await createEvent(fields, imageBuffer);

    if (result.error) {
      return NextResponse.json({ message: result.error }, { status: 400 });
    }

    // Return success response
    return NextResponse.json(
      { message: "Event created successfully!", event: result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { message: "Error creating event" },
      { status: 500 }
    );
  }
}

// Helper function for creating an event
async function createEvent(eventData: Record<string, string>, image: Buffer) {
  return new Promise((resolve) => {
    const {
      org_id,
      title,
      start_time,
      end_time,
      capacity,
      waitlist_capacity,
      price,
      street,
      city,
      state,
      zipcode,
      type,
      description,
      genre,
      event_link,
      access_code,
      speaker_name,
      instructor_name,
      topic,
    } = eventData;

    // Validate required fields
    if (
      !org_id ||
      !title ||
      !start_time ||
      !end_time ||
      !capacity ||
      !price ||
      !type ||
      !street ||
      !city ||
      !state ||
      !zipcode ||
      !description
    ) {
      return resolve({ error: "Missing required fields" });
    }

    // Set default or calculated fields
    const event_id = uuidv4(); // Generate a unique ID for the event

    const date = new Date().toISOString().split("T")[0];
    const availability = parseInt(capacity) > 0 ? "available" : "unavailable";

    // SQL query to insert a new event
    const sql = `
      INSERT INTO Event (
        event_id, org_id, title, start_time, end_time, date, capacity, waitlist_capacity, price, availability, street, city, state, zipcode, type, image, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      event_id,
      org_id,
      title,
      start_time,
      end_time,
      date,
      parseInt(capacity),
      parseInt(waitlist_capacity) || 0,
      parseFloat(price),
      availability,
      street,
      city,
      state,
      zipcode,
      type,
      image, // Store the binary image data
      description,
    ];

    // Execute the query
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error creating event:", err);
        return resolve({ error: "Internal server error" });
      }

      // Insert into specialization table based on event type
      if (type === "Concert") {
        const concertSql = `INSERT INTO Concert (event_id, genre) VALUES (?, ?)`;
        connection.query(concertSql, [event_id, genre], (err) => {
          if (err) console.error("Error creating concert:", err);
        });
      } else if (type === "Webinar") {
        const webinarSql = `INSERT INTO Webinar (event_id, event_link, access_code) VALUES (?, ?, ?)`;
        connection.query(
          webinarSql,
          [event_id, event_link, access_code],
          (err) => {
            if (err) console.error("Error creating webinar:", err);
          }
        );
      } else if (type === "Conference") {
        const conferenceSql = `INSERT INTO Conference (event_id, speaker_name) VALUES (?, ?)`;
        connection.query(conferenceSql, [event_id, speaker_name], (err) => {
          if (err) console.error("Error creating conference:", err);
        });
      } else if (type === "Workshop") {
        const workshopSql = `INSERT INTO Workshop (event_id, instructor_name, topic) VALUES (?, ?, ?)`;
        connection.query(
          workshopSql,
          [event_id, instructor_name, topic],
          (err) => {
            if (err) console.error("Error creating workshop:", err);
          }
        );
      }

      // Return the result if successful
      console.log("Event created successfully:", result);
      return resolve(result);
    });
  });
}
