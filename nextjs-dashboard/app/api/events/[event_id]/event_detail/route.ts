import connection from "../../../../lib/db";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

type Event = {
  event_id: string;
  org_id: string;
  title: string;
  start_time: string;
  end_time: string;
  capacity: number;
  waitlist_capacity: number;
  price: number;
  availability: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  type: string;
  image: string; // Assume the BLOB column for the image
  description: string;
  org_name: string;
  genre?: string; // For Concerts
  event_link?: string; // For Webinars
  access_code?: string; // For Webinars
  speaker_name?: string; // For Conferences
  instructor_name?: string; // For Workshops
  topic?: string; // For Workshops
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const event_id = url.pathname.split("/")[3]; // Extract event_id from the URL

    if (!event_id) {
      return NextResponse.json(
        { message: "Event ID is required." },
        { status: 400 }
      );
    }

    // SQL query to fetch the event details
    const sql = `
      SELECT 
        e.event_id,
        e.org_id,
        e.title, 
        e.start_time, 
        e.end_time, 
        e.capacity, 
        e.waitlist_capacity, 
        e.price, 
        e.street, 
        e.city, 
        e.state, 
        e.zipcode, 
        e.image AS image, 
        e.type, 
        e.description, 
        e.availability, 
        o.name AS org_name,
        c.genre,
        w.event_link, 
        w.access_code,
        conf.speaker_name,
        ws.instructor_name, 
        ws.topic,
        e.capacity - COUNT(DISTINCT t.ticket_id) as tickets_remaining
      FROM Event e
      JOIN Organization o ON e.org_id = o.org_id
      LEFT JOIN Concert c ON e.event_id = c.event_id
      LEFT JOIN Webinar w ON e.event_id = w.event_id
      LEFT JOIN Conference conf ON e.event_id = conf.event_id
      LEFT JOIN Workshop ws ON e.event_id = ws.event_id
      LEFT JOIN Ticket t ON e.event_id = t.event_id
      WHERE e.event_id = ?
      GROUP BY e.event_id;
    `;
    const values = [event_id];

    // Execute the query
    const results = await new Promise<RowDataPacket[]>((resolve, reject) => {
      connection.query(sql, values, (err, results) => {
        if (err) return reject(err);
        resolve(results as RowDataPacket[]);
      });
    });

    // Check if the event exists
    if (results.length === 0) {
      return NextResponse.json(
        { message: "Event not found." },
        { status: 404 }
      );
    }

    const event = results[0] as Event;

    // Optionally convert the image BLOB to base64 if needed
    // if (event.image) {
    //   event.image = Buffer.from(event.image).toString("base64");
    // }

    // Return the event details
    return NextResponse.json({
      message: "Event details fetched successfully!",
      event,
    });
  } catch (error) {
    console.error("Error fetching event details:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
