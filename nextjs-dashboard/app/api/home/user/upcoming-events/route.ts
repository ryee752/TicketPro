import connection from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const url = new URL(request.url);
    const user_id = url.searchParams.get("current_id") || ""; //user_id
    
    // SQL query to fetch the first 5 events that the user is subscribed to with the closest start-times
    const sql = `
      SELECT
        E.event_id, 
        E.org_id,
        E.title,
        E.start_time, 
        E.end_time, 
        E.date, 
        E.capacity, 
        E.waitlist_capacity, 
        E.price, 
        E.availability, 
        E.street, 
        E.city, 
        E.state, 
        E.zipcode, 
        E.type, 
        E.image, 
        E.description
      FROM Event E
      JOIN List_Of_Subscribed_Events LSE
        ON E.event_id = LSE.event_id
      WHERE LSE.user_id = ?
        AND E.start_time > NOW() -- Filter for events with start time after current date/time
      ORDER BY E.start_time ASC
      LIMIT 5;
    `;
    // Query parameters
    const values = [
      user_id
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
