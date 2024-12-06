import { NextRequest, NextResponse } from "next/server";
import connection from "../../../lib/db";

// Interface to match the Organization table structure
interface OrganizationResult {
  org_ID: string;
  name: string;
  website: string | null;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipcode: number;
  full_address?: string;
}

export async function GET(request: NextRequest) {
  try {
    // const organizationId = request.nextUrl.searchParams.get('organizationId');

    // if (!organizationId) {
    //   return NextResponse.json(
    //     { message: "Organization ID is required" },
    //     { status: 400 }
    //   );
    // }

    const fetchOrganizationDetails = (): Promise<OrganizationResult | null> => {
      return new Promise((resolve, reject) => {
        connection.query(
        `SELECT *
          FROM Organization 
          WHERE org_ID = ?
        `,
        [request.nextUrl.searchParams.get('organizationId')],
        (err, results: any[]) => {
            if (err) reject(err);
            
            // Check if results exist and have at least one item
            if (results && results.length > 0) {
              const organization = results[0] as OrganizationResult;
              
              // Combine first and last name for the profile display
              const organizationResult = {
                ...organization
              };

              resolve(organizationResult);
            } else {
              resolve(null);
            }
        }
        )
      });
    };

    const organizationDetails = await fetchOrganizationDetails();

    if (!organizationDetails) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      organization: organizationDetails
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching Organization details:", error);
    return NextResponse.json(
      { message: "Failed to fetch Organization details" },
      { status: 500 }
    );
  }
}