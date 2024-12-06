import connection from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

interface HostedEventsResult {
    event_id: string;
    org_id: string;
    title: string;
    startTime: string;  
    endTime: string;    
    date: Date;
    capacity: number;
    waitlist_capacity: number;
    price: number;      
    availability: 'available' | 'unavailable';  
    street: string;
    city: string;
    state: string;     
    zipcode: number;
    type: 'Concert' | 'Webinar' | 'Conference' | 'Workshop';  
    image: Buffer;      
    description: string; 
}


export async function GET(request: NextRequest) {
    try {
        const fetchHostedEventDetails = (): Promise<HostedEventsResult[]> => { // Changed return type to array
            return new Promise((resolve, reject) => {
                connection.query(
                    `
                    SELECT *
                    FROM Event
                    WHERE org_id = ?
                    `,
                    [request.nextUrl.searchParams.get(`organizationId`)],
                    (err, results: any[]) => {
                        if (err) reject(err);

                        // Return all results instead of just first one
                        if (results && results.length > 0) {
                            const hostedEvents = results as HostedEventsResult[];
                            resolve(hostedEvents);
                        } else {
                            resolve([]); // Return empty array instead of null
                        }
                    }
                )
            });
        };

        const hostedEventsDetails = await fetchHostedEventDetails();

        if (!hostedEventsDetails.length) { // Check for empty array
            return NextResponse.json(
                { message: "No events found" }, // Updated message
                { status: 404 }
            );
        }

        return NextResponse.json({
            hostedEvents: hostedEventsDetails
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching Event details:", error);
        return NextResponse.json(
            { message: "Failed to fetch Event details" },
            { status: 500 }
        )
    }
}