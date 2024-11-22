import mysql, { Connection } from "mysql2/promise";

let connection: Connection | null = null;

export const createConnection = async (): Promise<Connection> => {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST as string,
      user: process.env.DB_USER as string,
      password: process.env.DB_PASS as string,
      database: process.env.DB_NAME as string,
    });
  }
  return connection;
};
