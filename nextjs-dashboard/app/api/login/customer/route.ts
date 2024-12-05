import connection from "../../../lib/db";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log("Received login data:", { email });

    // Await the login result
    const result: any = await loginUser(email, password);

    // Check the result and return appropriate response
    if (result.error) {
      return NextResponse.json({ message: result.error }, { status: 401 });
    }

    // Return a success response only if login is successful
    return NextResponse.json(
      { message: "Login successful!", user: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during Login:", error);
    return NextResponse.json({ message: "Login failed." }, { status: 500 });
  }
}

export async function loginUser(email: string, password: string) {
  return new Promise((resolve, reject) => {
    // First query to find the user
    connection.query(
      "SELECT user_ID, password_ID, email FROM User WHERE email = ?",
      [email],
      (err, res) => {
        // Handle query errors
        if (err) {
          console.error("Error fetching user:", err);
          return resolve({ error: "Internal server error" });
        }

        // Convert result to typed array
        let rows: any = res;

        // Check if user exists
        if (rows.length === 0) {
          console.log("User not found!");
          return resolve({ error: "User not found!" });
        }

        const user = rows[0];

        // Second query to get password details
        connection.query(
          "SELECT hashed_password, password_salt FROM Passwords WHERE password_ID = ?",
          [user.password_ID],
          async (err, passwordRows) => {
            // Handle query errors
            if (err) {
              console.error("Error fetching password:", err);
              return resolve({ error: "Internal server error" });
            }

            let pwRows: any = passwordRows;
            if (pwRows.length === 0) {
              console.log("Password not found!");
              return resolve({ error: "Internal server error" });
            }

            const { hashed_password } = pwRows[0];

            // Compare passwords
            try {
              const passwordMatch = await bcrypt.compare(
                password,
                hashed_password
              );

              if (!passwordMatch) {
                console.log("Incorrect password!");
                return resolve({ error: "Incorrect password!" });
              }

              // Successful login
              console.log("User logged in successfully!");
              return resolve({
                id: user.user_ID,
                email: user.email,
              });
            } catch (compareError) {
              console.error("Password comparison error:", compareError);
              return resolve({ error: "Authentication error" });
            }
          }
        );
      }
    );
  });
}