import connection from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const event_id = url.pathname.split("/")[3]; // Extract the event_id from the URL

    if (!event_id) {
      return NextResponse.json(
        { message: "Event ID is required." },
        { status: 400 }
      );
    }

    // Query to find the event type
    const getTypeQuery = `
      SELECT type 
      FROM Event 
      WHERE event_id = ?
    `;
    const getTypeResults: RowDataPacket[] = await new Promise(
      (resolve, reject) => {
        connection.query(getTypeQuery, [event_id], (err, results) => {
          if (err) return reject(err);
          resolve(results as RowDataPacket[]);
        });
      }
    );

    // Check if the event exists
    if (getTypeResults.length === 0) {
      return NextResponse.json(
        { message: "Event not found." },
        { status: 404 }
      );
    }

    const eventType = getTypeResults[0].type;

    // Delete type-specific data
    let deleteTypeQuery = "";
    switch (eventType) {
      case "Concert":
        deleteTypeQuery = "DELETE FROM Concert WHERE event_id = ?";
        break;
      case "Webinar":
        deleteTypeQuery = "DELETE FROM Webinar WHERE event_id = ?";
        break;
      case "Conference":
        deleteTypeQuery = "DELETE FROM Conference WHERE event_id = ?";
        break;
      case "Workshop":
        deleteTypeQuery = "DELETE FROM Workshop WHERE event_id = ?";
        break;
      default:
        return NextResponse.json(
          { message: "Unknown event type." },
          { status: 400 }
        );
    }

    await new Promise<void>((resolve, reject) => {
      connection.query(deleteTypeQuery, [event_id], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Delete from the Event table
    const deleteEventQuery = `
      DELETE FROM Event 
      WHERE event_id = ?
    `;
    await new Promise<void>((resolve, reject) => {
      connection.query(deleteEventQuery, [event_id], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    console.log("Event deleted successfully.");
    return NextResponse.json(
      { message: "Event deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
