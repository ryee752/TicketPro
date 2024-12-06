import fs from "fs/promises";
import path from "path";
import connection from "../../../lib/db"; // Adjust path as necessary
import { NextRequest, NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, imagePath } = body;

    if (!eventId || !imagePath) {
      return NextResponse.json(
        { message: "Event ID and image path are required." },
        { status: 400 }
      );
    }

    // Resolve the absolute path of the image file
    const fullImagePath = path.resolve(imagePath);

    // Read the binary data from the image file
    const imageData = await fs.readFile(fullImagePath);

    // Construct the SQL query to update the image
    const sql = `UPDATE Event SET image = ? WHERE event_id = ?`;
    const values = [imageData, eventId];

    // Execute the query using promise-based connection
    const [result] = await connection
      .promise()
      .query<ResultSetHeader>(sql, values);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Event not found or no changes made." },
        { status: 404 }
      );
    }

    console.log("Event image updated successfully:", result);
    return NextResponse.json(
      { message: "Event image updated successfully.", result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating event image:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
