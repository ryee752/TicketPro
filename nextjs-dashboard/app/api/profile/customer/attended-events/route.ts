import connection from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

interface AttendedEventsResult {
    event_id: string;
    user_id: string;
    ticket_id: string;
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
        const userId = request.nextUrl.searchParams.get('userId');
        
        // Add validation for userId
        if (!userId) {
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 400 }
            );
        }

        const fetchAttendedEventDetails = (): Promise<AttendedEventsResult[]> => {
            return new Promise((resolve, reject) => {
                // Log the query and userId for debugging
                console.log('Executing query for userId:', userId);
                
                connection.query(
                    `
                    SELECT 
                        e.*,
                        t.ticket_id,
                        t.user_id
                    FROM Ticket t
                    LEFT JOIN Event e ON e.event_id = t.event_id
                    WHERE t.user_id = ?
                    `,
                    [userId],
                    (err, results: RowDataPacket[]) => {
                        if (err) {
                            console.error('Database error:', err);
                            reject(err);
                            return;
                        }

                        console.log('Query results:', results); // Log results

                        // Convert database fields to match interface
                        const attendedEvents = results.map(event => ({
                            ...event,
                        }));

                        resolve(attendedEvents);
                    }
                )
            });
        };

        const attendedEventsDetails = await fetchAttendedEventDetails();

        // Log the processed events
        console.log('Processed events:', attendedEventsDetails);

        // Return empty array instead of 404
        return NextResponse.json({
            attendedEvents: attendedEventsDetails || []
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching Event details:", error);
        return NextResponse.json(
            { 
                message: "Failed to fetch Event details",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        )
    }
}