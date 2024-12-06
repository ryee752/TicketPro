import connection from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

export async function GET(request: NextRequest) {
  try {
    
    // SQL query to fetch the top 5 organizations with the most events. This query can be optimized to better find popular organizations
    const sql = `
      SELECT 
          o.org_ID,
          o.name,
          o.email,
          o.phone,
          o.website,
          o.street,
          o.city,
          o.state,
          o.zipcode,
          COUNT(e.event_id) AS event_count
      FROM 
          Organization o
      LEFT JOIN 
          Event e ON o.org_ID = e.org_id
      GROUP BY 
          o.org_ID, o.name
      ORDER BY 
          event_count DESC
      LIMIT 5;
    `;

    // Query Execution
    const organizations = await new Promise<RowDataPacket[]>((resolve, reject) => {
      connection.query(sql, (err, results) => {
        if (err) {
          console.error("Error fetching filtered organizations:", err);
          return reject("Internal server error");
        }

        resolve(results as RowDataPacket[]);
      });
    });
  

    // Convert BLOB to base64
    const formedResult = organizations.map((organization: any) => ({
      ...organization,
      // image: event.image ? Buffer.from(event.image).toString("base64") : null,
    }));

    return NextResponse.json(
      { organizations: formedResult, message: "Organizations fetched successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { message: "Failed to fetch organizations." },
      { status: 500 }
    );
  }
}
