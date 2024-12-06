import connection from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

export async function GET(request: NextRequest) {
  try {

    // This SQL query fetches the top 5 events with the most attendees
    // Note: Until Tickets table is completed, this query is untested
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
          E.description,
          COUNT(T.ticket_id) AS tickets_sold,
          (E.capacity - COUNT(T.ticket_id)) AS spots_left
      FROM 
          Event E
      LEFT JOIN 
          Ticket T ON E.event_id = T.event_id
      GROUP BY 
          E.event_id, E.title, E.capacity
      ORDER BY 
          tickets_sold DESC
      LIMIT 5;
    `;

    const events = await new Promise<RowDataPacket[]>((resolve, reject) => {
      connection.query(sql, (err, results) => {
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
