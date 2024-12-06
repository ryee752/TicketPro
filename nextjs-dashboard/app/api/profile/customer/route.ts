import { NextRequest, NextResponse } from "next/server";
import connection from "../../../lib/db"; // Adjust path as needed

// Interface to match the User table structure
interface UserResult {
  user_ID: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
}

export async function GET(request: NextRequest) {
  try {
    // Function to fetch user details
    const fetchUserDetails = (): Promise<UserResult | null> => {
      return new Promise((resolve, reject) => {
        connection.query(
          `SELECT user_ID, first_name, last_name, phone, email
           FROM User 
           WHERE user_ID = ?`,
          [request.nextUrl.searchParams.get('userId')],
          (err, results: any[]) => {
            if (err) reject(err);
            
            // Check if results exist and have at least one item
            if (results && results.length > 0) {
              const user = results[0] as UserResult;
              
              // Combine first and last name for the profile display
              const profileResult = {
                ...user,
                name: `${user.first_name} ${user.last_name}`
              };

              resolve(profileResult);
            } else {
              resolve(null);
            }
          }
        );
      });
    };

    // Fetch user details
    const userDetails = await fetchUserDetails();

    // Check if user details are found
    if (!userDetails) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: userDetails
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json({ message: "Failed to fetch user details" }, { status: 500 });
  }
}