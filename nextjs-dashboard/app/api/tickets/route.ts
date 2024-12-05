import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export async function POST(request: Request) {
  try {
    const { userId, eventId, price, paymentDetails } = await request.json();
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Get the current highest seat number for this event
      const [rows] = await connection.execute(
        'SELECT COALESCE(MAX(seat_num), 0) as max_seat FROM Ticket WHERE event_id = ?',
        [eventId]
      );
      const nextSeatNum = (rows as any)[0].max_seat + 1;

      // Generate unique ticket ID
      const ticketId = `TKT${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      // Insert ticket with the next seat number
      await connection.execute(
        'INSERT INTO Ticket (ticket_id, user_id, event_id, expiration_date, price, seat_num) VALUES (?, ?, ?, ?, ?, ?)',
        [ticketId, userId, eventId, expiryDate, price, nextSeatNum]
      );

      // Save payment method
      const methodId = `PAY${Date.now()}`;
      await connection.execute(
        'INSERT INTO Payment_Method (method_id, user_id, street, city, state, zipcode, card_number, last_four, card_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          methodId,
          userId,
          paymentDetails.street,
          paymentDetails.city,
          paymentDetails.state,
          paymentDetails.zipCode,
          paymentDetails.cardNumber,
          paymentDetails.lastFour,
          paymentDetails.cardType
        ]
      );

      await connection.commit();
      return NextResponse.json({ ticketId, seatNum: nextSeatNum }, { status: 201 });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}