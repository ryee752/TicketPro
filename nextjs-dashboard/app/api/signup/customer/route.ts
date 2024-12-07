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

    // check if user already exists
    console.log("Checking User Email");
    const existURes: any = await checkExistingUser(email);
    console.log("Email Checked");
    if (existURes.error) {
      return NextResponse.json({ error: existURes.error }, { status: 500 });
    }

    // checks if org already exists
    console.log("Checking Organization Email");
    const existORes: any = await checkExistingOrganization(email);
    console.log("Email Checked");
    if (existORes.error) {
      return NextResponse.json({ error: existORes.error }, { status: 500 });
    }

    // Await the registration result
    const regResult: any = await registerUser(
      first,
      last,
      phone,
      email,
      password
    );

    // Check the result and return appropriate response
    if (regResult.error) {
      return NextResponse.json({ message: regResult.error }, { status: 500 });
    }

    // Return a success response with user_ID
    return NextResponse.json(
      { message: "Registration successful!", user: regResult },
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

async function checkExistingUser(email: string) {
  console.log("Checking for existing User with email: " + email);

  // Check if User exists with this email
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM User where email = (?)",
      [email],
      (err, result) => {
        if (err) {
          console.error("Error inserting user:", err);
          return resolve({ error: err });
        }
        let rows: any = result;
        if (rows.length === 0) {
          console.log("No registered User with this email");
          return resolve({
            message: "No User registered with email: " + email,
          });
        } else {
          console.error("User already registered with email: " + email);
          return resolve({
            error: "User already registered with email: " + email,
          });
        }
      }
    );
  });
}

async function checkExistingOrganization(email: string) {
  console.log("Checking for existing Organization with email: " + email);

  // Check if Organization exists with this email
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM Organization where email = (?)",
      [email],
      (err, result) => {
        if (err) {
          console.error("Error finding Organization:", err);
          return resolve({ error: err });
        }
        let rows: any = result;
        if (rows.length === 0) {
          console.log("No registered Organization with this email");
          return resolve({
            message: "No Organization registered with email: " + email,
          });
        } else {
          console.error("Organization already registered with email: " + email);
          return resolve({
            error: "Organization already registered with email: " + email,
          });
        }
      }
    );
  });
}

async function registerUser(
  first_name: string,
  last_name: string,
  phone: string,
  email: string,
  password: string
) {
  console.log("Registering User");

  const user_ID = uuidv4();
  const password_ID = uuidv4();
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashed_password = await bcrypt.hash(password, salt);
  const creation_date = new Date();
  const last_update_date = creation_date;

  try {
    // Insert password into the database
    await new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO Passwords (password_ID, hashed_password, password_salt, creation_date, last_update_date) VALUES (?, ?, ?, ?, ?)",
        [password_ID, hashed_password, salt, creation_date, last_update_date],
        (err, result) => {
          if (err) {
            console.error("Error inserting password:", err);
            return reject({ error: "Internal server error" });
          }
          console.log("Password inserted for user with ID:", user_ID);
          resolve(result);
        }
      );
    });

    // Insert user into the User table
    await new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO User (user_ID, password_ID, first_name, last_name, phone, email) VALUES (?, ?, ?, ?, ?, ?)",
        [user_ID, password_ID, first_name, last_name, phone, email],
        (err, result) => {
          if (err) {
            console.error("Error inserting user:", err);
            return reject({ error: "Internal server error" });
          }
          console.log("Registered user with ID:", user_ID);
          resolve(result);
        }
      );
    });

    // Return user ID and email on successful registration
    return { id: user_ID, email };
  } catch (error) {
    console.error("Error during registration:", error);
    throw new Error("Internal server error");
  }
}
