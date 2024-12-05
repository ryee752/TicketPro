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

// Helper function for creating an event
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
      values.push(image); // Convert Buffer to base64 string
    }

    sql += ` WHERE event_id = ?`;
    values.push(event_id);

    // Execute the query
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error updating event:", err);
        return resolve({ error: "Internal server error" });
      }

      // Return the result if successful
      console.log("Event updated successfully:", result);
      return resolve(result);
    });
  });
}
