import connection from "../../../lib/db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      website,
      phone,
      email,
      street,
      city,
      state,
      zipCode,
      password,
    } = await request.json();

    console.log("Received registration data:", {
      name,
      website,
      phone,
      email,
      street,
      city,
      state,
      zipCode,
      password,
    });

    // Await the registration result
    const result: any = await registerOrg(
      name,
      website,
      phone,
      email,
      street,
      city,
      state,
      zipCode,
      password
    );

    // Check the result and return appropriate response
    if (result.error) {
      return NextResponse.json({ message: result.error }, { status: 500 });
    }

    // Return a success response with org_ID and password_ID
    return NextResponse.json(
      {
        message: "Registration successful!",
        user: result,
      },
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

export async function registerOrg(
  name: string,
  website: string,
  phone: string,
  email: string,
  street: string,
  city: string,
  state: string,
  zipCode: string,
  password: string
) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Registering Organization");

      const org_ID = uuidv4();
      const password_ID = uuidv4();
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashed_password = await bcrypt.hash(password, salt);
      const creation_date = new Date();
      const last_update_date = creation_date;

      // Insert password into the Passwords table
      connection.query(
        "INSERT INTO Passwords (password_ID, hashed_password, password_salt, creation_date, last_update_date) VALUES (?, ?, ?, ?, ?)",
        [password_ID, hashed_password, salt, creation_date, last_update_date],
        (err, result) => {
          if (err) {
            console.error("Error inserting password:", err);
            return resolve({ error: "Internal server error" });
          }

          console.log("Password inserted for organization with ID:", org_ID);

          // Insert organization into the Organization table
          connection.query(
            "INSERT INTO Organization (org_ID, password_ID, name, email, phone, website, street, city, state, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              org_ID,
              password_ID,
              name,
              email,
              phone,
              website,
              street,
              city,
              state,
              zipCode,
            ],
            (err, result) => {
              if (err) {
                console.error("Error inserting organization:", err);
                return resolve({ error: "Internal server error" });
              }

              console.log("Registered organization with ID:", org_ID);

              // Resolve with org_ID and password_ID
              return resolve({
                id: org_ID,
                email,
              });
            }
          );
        }
      );
    } catch (error) {
      console.error("Error registering organization:", error);
      return resolve({ error: "Internal server error" });
    }
  });
}
