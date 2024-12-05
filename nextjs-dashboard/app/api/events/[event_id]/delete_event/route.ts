import connection from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { event_id: string } }
) {
  return new Promise(async (resolve) => {
    const { event_id } = params;

    if (!event_id) {
      return resolve(
        NextResponse.json({ message: "Event ID is required." }, { status: 400 })
      );
    }

    // Query to find the event type
    const getTypeQuery = `
      SELECT type 
      FROM Event 
      WHERE event_id = ?
    `;

    // Execute query to get event type
    connection.query(
      getTypeQuery,
      [event_id],
      (getTypeErr, getTypeResults: RowDataPacket[]) => {
        if (getTypeErr) {
          console.error("Error fetching event type:", getTypeErr);
          return resolve(
            NextResponse.json(
              { message: "Error fetching event type." },
              { status: 500 }
            )
          );
        }

        // Check if the event exists
        if (getTypeResults.length === 0) {
          return resolve(
            NextResponse.json({ message: "Event not found." }, { status: 404 })
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
            console.error("Unknown event type.");
            return resolve(
              NextResponse.json(
                { message: "Unknown event type." },
                { status: 400 }
              )
            );
        }

        connection.query(deleteTypeQuery, [event_id], (deleteTypeErr) => {
          if (deleteTypeErr) {
            console.error("Error deleting type-specific data:", deleteTypeErr);
            return resolve(
              NextResponse.json(
                { message: "Error deleting type-specific data." },
                { status: 500 }
              )
            );
          }

          // Delete from the Event table
          const deleteEventQuery = `
          DELETE FROM Event 
          WHERE event_id = ?
        `;
          connection.query(deleteEventQuery, [event_id], (deleteEventErr) => {
            if (deleteEventErr) {
              console.error("Error deleting event:", deleteEventErr);
              return resolve(
                NextResponse.json(
                  { message: "Error deleting event." },
                  { status: 500 }
                )
              );
            }

            console.log("Event deleted successfully.");
            return resolve(
              NextResponse.json(
                { message: "Event deleted successfully!" },
                { status: 200 }
              )
            );
          });
        });
      }
    );
  });
}
