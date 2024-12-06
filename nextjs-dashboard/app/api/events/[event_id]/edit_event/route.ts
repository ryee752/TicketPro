import connection from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse the form data
    const contentType = request.headers.get("content-type");

    if (!contentType || !contentType.startsWith("multipart/form-data")) {
      return NextResponse.json(
        { message: "Invalid content type" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const fields: Record<string, string> = {};
    let imageBuffer: Buffer | null = null;

    // Process form fields and file
    formData.forEach((value, key) => {
      if (key === "image" && value instanceof File) {
        const arrayBufferPromise = value.arrayBuffer();
        arrayBufferPromise.then((arrayBuffer) => {
          imageBuffer = Buffer.from(arrayBuffer);
        });
      } else {
        fields[key] = value.toString();
      }
    });

    // Wait for imageBuffer to be ready
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Call the helper function to create the event
    const result: any = await editEvent(fields, imageBuffer);

    if (result.error) {
      return NextResponse.json({ message: result.error }, { status: 400 });
    }

    // Return success response
    return NextResponse.json(
      { message: "Event created successfully!", event: result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { message: "Failed to create event." },
      { status: 500 }
    );
  }
}

// Helper function for editing an event
export async function editEvent(eventData: Record<string, string>, image: any) {
  return new Promise((resolve) => {
    const {
      event_id,
      title,
      start_time,
      end_time,
      capacity,
      waitlist_capacity,
      price,
      street,
      city,
      state,
      zipcode,
      type,
      description,
      genre,
      event_link,
      access_code,
      speaker_name,
      instructor_name,
      topic,
      original_type, // The original type before the change
    } = eventData;

    // Validate required fields
    if (
      !event_id ||
      !title ||
      !start_time ||
      !end_time ||
      !capacity ||
      !price ||
      !type ||
      !street ||
      !city ||
      !state ||
      !zipcode ||
      !description
    ) {
      return resolve({ error: "Missing required fields" });
    }

    // SQL query for updating the event
    let sql = `
        UPDATE Event
        SET
          title = ?, 
          start_time = ?, 
          end_time = ?, 
          capacity = ?, 
          waitlist_capacity = ?, 
          price = ?, 
          street = ?, 
          city = ?, 
          state = ?, 
          zipcode = ?, 
          type = ?, 
          description = ?
      `;
    const values: (string | number)[] = [
      title,
      start_time,
      end_time,
      parseInt(capacity),
      parseInt(waitlist_capacity) || 0,
      parseFloat(price),
      street,
      city,
      state,
      zipcode,
      type,
      description,
    ];

    // Add image to the query if provided
    if (image) {
      sql += `, image = ?`;
      values.push(image);
    }

    sql += ` WHERE event_id = ?`;
    values.push(event_id);

    // Execute the main Event update query
    connection.query(sql, values, async (err, result) => {
      if (err) {
        console.error("Error updating event:", err);
        return resolve({ error: "Internal server error" });
      }

      // Handle type change
      if (type !== original_type) {
        // Remove old type-specific data
        let deleteSql = "";
        if (original_type === "Concert") {
          deleteSql = "DELETE FROM Concert WHERE event_id = ?";
        } else if (original_type === "Webinar") {
          deleteSql = "DELETE FROM Webinar WHERE event_id = ?";
        } else if (original_type === "Conference") {
          deleteSql = "DELETE FROM Conference WHERE event_id = ?";
        } else if (original_type === "Workshop") {
          deleteSql = "DELETE FROM Workshop WHERE event_id = ?";
        }

        if (deleteSql) {
          await new Promise<void>((resolveDelete) => {
            connection.query(deleteSql, [event_id], (deleteErr) => {
              if (deleteErr) {
                console.error(
                  "Error deleting old type-specific data:",
                  deleteErr
                );
                return resolveDelete();
              }
              console.log("Old type-specific data deleted successfully");
              resolveDelete();
            });
          });
        }

        // Insert new type-specific data
        let insertSql = "";
        const insertValues: any[] = [event_id];
        if (type === "Concert") {
          insertSql = "INSERT INTO Concert (event_id, genre) VALUES (?, ?)";
          insertValues.push(genre);
        } else if (type === "Webinar") {
          insertSql =
            "INSERT INTO Webinar (event_id, event_link, access_code) VALUES (?, ?, ?)";
          insertValues.push(event_link, access_code);
        } else if (type === "Conference") {
          insertSql =
            "INSERT INTO Conference (event_id, speaker_name) VALUES (?, ?)";
          insertValues.push(speaker_name);
        } else if (type === "Workshop") {
          insertSql =
            "INSERT INTO Workshop (event_id, instructor_name, topic) VALUES (?, ?, ?)";
          insertValues.push(instructor_name, topic);
        }

        if (insertSql) {
          await new Promise<void>((resolveInsert) => {
            connection.query(insertSql, insertValues, (insertErr) => {
              if (insertErr) {
                console.error(
                  "Error inserting new type-specific data:",
                  insertErr
                );
                return resolveInsert();
              }
              console.log("New type-specific data inserted successfully");
              resolveInsert(); // Call resolveInsert with no arguments
            });
          });
        }
      }

      console.log("Event updated successfully:", result);
      return resolve(result);
    });
  });
}
