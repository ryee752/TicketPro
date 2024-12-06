import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

interface MaxSeatRow extends RowDataPacket {
  max_seat: number;
}

interface PaymentMethodRow extends RowDataPacket {
  method_id: string;
}

interface EventAvailability extends RowDataPacket {
  capacity: number;
  current_tickets: number;
  availability: string;
}

// Function to hash card details
async function hashCardData(value: string): Promise<{ hash: string; salt: string }> {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(value, salt);
  return { hash, salt };
}

// Helper function to check event availability
async function checkEventAvailability(connection: mysql.PoolConnection, eventId: string, requestedQuantity: number): Promise<boolean> {
  const [availabilityData] = await connection.execute<EventAvailability[]>(
    `SELECT 
      e.capacity,
      e.availability,
      COUNT(t.ticket_id) as current_tickets
    FROM Event e
    LEFT JOIN Ticket t ON e.event_id = t.event_id
    WHERE e.event_id = ?
    GROUP BY e.event_id`,
    [eventId]
  );

  if (!availabilityData || availabilityData.length === 0) {
    throw new Error('Event not found');
  }

  const { capacity, current_tickets, availability } = availabilityData[0];
  
  if (availability === 'unavailable') {
    return false;
  }

  const remainingCapacity = capacity - current_tickets;
  return remainingCapacity >= requestedQuantity;
}

// Helper function to check if event is at full capacity
async function isEventFullyBooked(connection: mysql.PoolConnection, eventId: string): Promise<boolean> {
  const [availabilityData] = await connection.execute<EventAvailability[]>(
    `SELECT 
      e.capacity,
      COUNT(t.ticket_id) as current_tickets
    FROM Event e
    LEFT JOIN Ticket t ON e.event_id = t.event_id
    WHERE e.event_id = ?
    GROUP BY e.event_id`,
    [eventId]
  );

  if (!availabilityData || availabilityData.length === 0) {
    throw new Error('Event not found');
  }

  return availabilityData[0].current_tickets >= availabilityData[0].capacity;
}

export async function POST(request: Request) {
  try {
    const { userId, eventId, price, quantity, paymentDetails } = await request.json();
    const parsedQuantity = parseInt(quantity, 10);
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Check event availability before proceeding
      const isAvailable = await checkEventAvailability(connection, eventId, parsedQuantity);
      if (!isAvailable) {
        await connection.rollback();
        return NextResponse.json(
          { error: 'Event is unavailable or has insufficient capacity' },
          { status: 400 }
        );
      }

      // Hash only the card number
      const { hash: hashedCard, salt: cardSalt } = await hashCardData(paymentDetails.cardNumber);
      
      // Check for existing payment method
      const [existingMethods] = await connection.execute<PaymentMethodRow[]>(
        'SELECT method_id FROM Payment_Method WHERE user_id = ?',
        [userId]
      );

      let methodId;
      if (existingMethods.length === 0) {
        // Create new payment method
        methodId = crypto.randomUUID();
        await connection.execute(
          `INSERT INTO Payment_Method (
            method_id, user_id, first_name, last_name, 
            street, city, state, zipcode,
            card_number, card_salt, last_four, card_type,
            expiry_date, cvv
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            methodId,
            userId,
            paymentDetails.firstName,
            paymentDetails.lastName,
            paymentDetails.street,
            paymentDetails.city,
            paymentDetails.state,
            paymentDetails.zipCode,
            hashedCard,
            cardSalt,
            paymentDetails.lastFour,
            paymentDetails.cardType,
            paymentDetails.expiryDate,
            paymentDetails.cvv
          ]
        );
      } else {
        // Update existing payment method
        methodId = existingMethods[0].method_id;
        await connection.execute(
          `UPDATE Payment_Method SET 
            first_name = ?, last_name = ?,
            street = ?, city = ?, state = ?, zipcode = ?,
            card_number = ?, card_salt = ?, last_four = ?, card_type = ?,
            expiry_date = ?, cvv = ?
          WHERE method_id = ?`,
          [
            paymentDetails.firstName,
            paymentDetails.lastName,
            paymentDetails.street,
            paymentDetails.city,
            paymentDetails.state,
            paymentDetails.zipCode,
            hashedCard,
            cardSalt,
            paymentDetails.lastFour,
            paymentDetails.cardType,
            paymentDetails.expiryDate,
            paymentDetails.cvv,
            methodId
          ]
        );
      }

      // Get next seat number
      const [rows] = await connection.execute<MaxSeatRow[]>(
        'SELECT COALESCE(MAX(seat_num), 0) as max_seat FROM Ticket WHERE event_id = ?',
        [eventId]
      );
      const nextSeatNum = rows[0].max_seat + 1;
      
      
    



      // Create tickets
      for (let i = 0; i < parsedQuantity; i++) {
        const ticketId = `TKT${Date.now()}${Math.floor(Math.random() * 1000)}_${i}`;
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        
        await connection.execute(
          'INSERT INTO Ticket (ticket_id, user_id, event_id, expiration_date, price, seat_num) VALUES (?, ?, ?, ?, ?, ?)',
          [ticketId, userId, eventId, expiryDate, price, nextSeatNum + i]
        );
      }

      // Check if event is now at full capacity and update availability if needed
      const isFullyBooked = await isEventFullyBooked(connection, eventId);
      if (isFullyBooked) {
        await connection.execute(
          'UPDATE Event SET availability = ? WHERE event_id = ?',
          ['unavailable', eventId]
        );
      }

      await connection.commit();
      return NextResponse.json({ message: "Tickets created successfully" });

    } catch (error) {
      await connection.rollback();
      console.error('Error in ticket creation:', error);
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}