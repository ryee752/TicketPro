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

export async function GET(
  request: Request,
  { params }: { params: { event_id: string } }
) {
  return new Promise(async (resolve) => {
    const { event_id } = await params; // Access params directly

    if (!event_id) {
      return resolve(
        NextResponse.json({ message: "Event ID is required." }, { status: 400 })
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
    \`e\`.\`type\`, -- Escaped with backticks
    e.description, 
    e.availability, 
    o.name AS org_name,
    c.genre, -- From Concert table
    w.event_link, 
    w.access_code, -- From Webinar table
    conf.speaker_name, -- From Conference table
    ws.instructor_name, 
    ws.topic -- From Workshop table
  FROM Event e
  JOIN Organization o ON e.org_id = o.org_id
  LEFT JOIN Concert c ON e.event_id = c.event_id
  LEFT JOIN Webinar w ON e.event_id = w.event_id
  LEFT JOIN Conference conf ON e.event_id = conf.event_id
  LEFT JOIN Workshop ws ON e.event_id = ws.event_id
  WHERE e.event_id = ?;
`;
    const values = [event_id];

    // Execute the query
    connection.query(sql, values, (err, results: RowDataPacket[]) => {
      if (err) {
        console.error("Error fetching event details:", err);
        return resolve(
          NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
          )
        );
      }

      // Check if the event exists
      if (results.length === 0) {
        return resolve(
          NextResponse.json({ message: "Event not found." }, { status: 404 })
        );
      }

      const event = results[0] as Event;

      // Convert the image BLOB to base64 if it exists
      // if (event.image) {
      //   event.image = Buffer.from(event.image).toString("base64");
      // }

      // Return the event details
      console.log("Read event detail successfully:", event);
      return resolve(
        NextResponse.json({
          message: "Event details fetched successfully!",
          event,
        })
      );
    });
  });
}
