import { createConnection } from "@/app/lib/mysql";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const db = await createConnection();
    const sql = "SELECT * FROM Event";
    const [Event] = await db.query(sql);
    return NextResponse.json(Event);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ e });
  }
};
