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

async function registerOrg(
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
  console.log("Registering Organization");

  const org_ID = uuidv4();
  const password_ID = uuidv4();
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashed_password = await bcrypt.hash(password, salt);
  const creation_date = new Date();
  const last_update_date = creation_date;

  try {
    // Insert password into the Passwords table
    await new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO Passwords (password_ID, hashed_password, password_salt, creation_date, last_update_date) VALUES (?, ?, ?, ?, ?)",
        [password_ID, hashed_password, salt, creation_date, last_update_date],
        (err, result) => {
          if (err) {
            console.error("Error inserting password:", err);
            return reject({ error: "Internal server error" });
          }
          console.log("Password inserted for organization with ID:", org_ID);
          resolve(result);
        }
      );
    });

    // Insert organization into the Organization table
    await new Promise((resolve, reject) => {
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
            return reject({ error: "Internal server error" });
          }
          console.log("Registered organization with ID:", org_ID);
          resolve(result);
        }
      );
    });

    // Return org_ID and email on successful registration
    return { id: org_ID, email };
  } catch (error) {
    console.error("Error registering organization:", error);
    throw new Error("Internal server error");
  }
}
