import connection from "../../lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Fetch the event list
    const result: any = await fetchEvents();

    // Check for errors
    if (result.error) {
      return NextResponse.json({ message: result.error }, { status: 400 });
    }

    // Handle empty results
    if (result.length === 0) {
      return NextResponse.json(
        { message: "No events found.", events: [] },
        { status: 200 }
      );
    }

    // Return the fetched event list
    return NextResponse.json(
      { message: "Events fetched successfully!", events: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { message: "Failed to fetch events." },
      { status: 500 }
    );
  }
}

// Helper function for fetching events
export async function fetchEvents() {
  return new Promise((resolve) => {
    // SQL query to fetch all events
    const sql = `
      SELECT 
        event_id, 
        org_id,
        title,
        start_time, 
        end_time, 
        date, 
        capacity, 
        waitlist_capacity, 
        price, 
        availability, 
        street, 
        city, 
        state, 
        zipcode, 
        type, 
        image, 
        description
      FROM Event
      ORDER BY date ASC, start_time ASC;
    `;

    connection.query(sql, [], (err, results) => {
      if (err) {
        console.error("Error fetching events:", err);
        return resolve({ error: "Database query failed." });
      }

      // Cast results to an array of event objects
      const events = (results as any[]).map((event) => ({
        ...event,
        image: event.image ? event.image.toString("base64") : null, // Convert BLOB to base64
      }));

      console.log("Events fetched successfully:", events);
      return resolve(events);
    });
  });
}
