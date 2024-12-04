import connection from "../../../lib/db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { first, last, phone, email, password } = await request.json();

    console.log("Received registration data:", {
      first,
      last,
      phone,
      email,
      password,
    });

    // Await the registration result
    const result: any = await registerUser(first, last, phone, email, password);

    // Check the result and return appropriate response
    if (result.error) {
      return NextResponse.json({ message: result.error }, { status: 500 });
    }

    // Return a success response with user_ID
    return NextResponse.json(
      { message: "Registration successful!", user: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { message: "Registration failed." },
      { status: 500 }
    );
  }
}

export async function registerUser(
  first_name: string,
  last_name: string,
  phone: string,
  email: string,
  password: string
) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Registering User");

      const user_ID = uuidv4();
      const password_ID = uuidv4();
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashed_password = await bcrypt.hash(password, salt);
      const creation_date = new Date();
      const last_update_date = creation_date;

      // Insert password into the database
      connection.query(
        "INSERT INTO Passwords (password_ID, hashed_password, password_salt, creation_date, last_update_date) VALUES (?, ?, ?, ?, ?)",
        [password_ID, hashed_password, salt, creation_date, last_update_date],
        (err, result) => {
          if (err) {
            console.error("Error inserting password:", err);
            return resolve({ error: "Internal server error" });
          }

          console.log("Password inserted for user with ID:", user_ID);

          // Insert user into the User table
          connection.query(
            "INSERT INTO User (user_ID, password_ID, first_name, last_name, phone, email) VALUES (?, ?, ?, ?, ?, ?)",
            [user_ID, password_ID, first_name, last_name, phone, email],
            (err, result) => {
              if (err) {
                console.error("Error inserting user:", err);
                return resolve({ error: "Internal server error" });
              }

              console.log("Registered user with ID:", user_ID);

              // Resolve with user_ID on successful registration
              return resolve({ id: user_ID, email });
            }
          );
        }
      );
    } catch (error) {
      console.error("Error registering user:", error);
      return resolve({ error: "Internal server error" });
    }
  });
}
