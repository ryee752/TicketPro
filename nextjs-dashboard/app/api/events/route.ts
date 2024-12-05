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
    //const index = put the index thing here 

    // SQL query to fetch events with filtering
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
      WHERE
        title LIKE ? AND
        city LIKE ? AND
        (type = ? OR ? = '') AND
        price BETWEEN ? AND ?
      ORDER BY date ASC, start_time ASC;
    `;

    // Query parameters
    const values = [
      `%${search}%`,
      `%${location}%`,
      category,
      category,
      minPrice,
      maxPrice,
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
