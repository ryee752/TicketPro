import connection from "../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || ""; //title
    const location = url.searchParams.get("location") || ""; // city
    const category = url.searchParams.get("category") || "";
    const minPrice = parseFloat(url.searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(url.searchParams.get("maxPrice") || "9999999");
    const genre =
      category === "Concert" ? url.searchParams.get("genre") || "" : "";
    const speaker_name =
      category === "Conference"
        ? url.searchParams.get("speaker_name") || ""
        : "";
    const instructor_name =
      category === "Workshop"
        ? url.searchParams.get("instructor_name") || ""
        : "";
    const topic =
      category === "Workshop" ? url.searchParams.get("topic") || "" : "";

    // SQL query to fetch events with filtering
    const sql = `
  SELECT
    e.event_id, 
    e.org_id,
    e.title,
    e.start_time, 
    e.end_time, 
    e.date, 
    e.capacity, 
    e.waitlist_capacity, 
    e.price, 
    e.availability, 
    e.street, 
    e.city, 
    e.state, 
    e.zipcode, 
    e.type, 
    e.image, 
    e.description,
    c.genre,
    conf.speaker_name,
    w.instructor_name,
    w.topic
  FROM Event e
  LEFT JOIN Concert c ON e.event_id = c.event_id
  LEFT JOIN Conference conf ON e.event_id = conf.event_id
  LEFT JOIN Workshop w ON e.event_id = w.event_id
  WHERE
    e.title LIKE ? AND
    e.city LIKE ? AND
    (e.type = ? OR ? = '') AND
    e.price BETWEEN ? AND ? AND
    (c.genre LIKE ? OR ? = '') AND
    (conf.speaker_name LIKE ? OR ? = '') AND
    (w.instructor_name LIKE ? OR ? = '') AND
    (w.topic LIKE ? OR ? = '')
  ORDER BY e.date ASC, e.start_time ASC;
`;

    // Query parameters
    const values = [
      `%${search}%`,
      `%${location}%`,
      category,
      category,
      minPrice,
      maxPrice,
      `%${genre}%`,
      genre,
      `%${speaker_name}%`,
      speaker_name,
      `%${instructor_name}%`,
      instructor_name,
      `%${topic}%`,
      topic,
    ];

    // Query Execution
    const events = await new Promise<RowDataPacket[]>((resolve, reject) => {
      connection.query(sql, values, (err, results) => {
        if (err) {
          console.error("Error fetching filtered events:", err);
          return reject("Internal server error");
        }

        resolve(results as RowDataPacket[]);
      });
    });

    // Convert BLOB to base64
    const formedResult = events.map((event: any) => ({
      ...event,
      // image: event.image ? Buffer.from(event.image).toString("base64") : null,
    }));

    return NextResponse.json(
      { events: formedResult, message: "Events fetched successfully!" },
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
