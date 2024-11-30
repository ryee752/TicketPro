# TicketPro

Our web-based application is an event management and ticketing platform that allows event organizers to create, promote, and manage events, while providing attendees with a streamlined experience for discovering, purchasing tickets, and attending events. It can cater to a wide range of events such as concerts, webinars, conferences, workshops, and community gatherings. 


## Requirements
Install NPM and Node.js (Installation: [Link](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))<br />
Node.js v20.18.0<br />
NPM 10.8.2<br />
### MySQl
Install MySQL Workbench (Installation [Link](https://dev.mysql.com/downloads/workbench/))<br />
1. Create an account for the root user
2. Create and Use a database called ticket_pro
3. Execute the tm_createdb.sql file

### .env File
1. Create an .env file and include the following environmental variables (Replace password with the password used for the root user in the previous steps)<br />
DB_HOST=localhost<br />
DB_USER=root<br />
DB_PASSWORD=password<br />
DB_NAME=ticket_pro<br />
2. Add the .env file to the nextjs-dashboard directory

###

## Installation

1. Switch to ./nextjs-dashboard folder (Using cd command) after cloning Repository

2. Install pnpm
```bash
      npm install -g pnpm
   ```

3. Install dependencies using pnpm:
```bash
   pnpm i
   ```

## Starting the application
1. Start the development server with the following command:
```bash
   pnpm dev
   ```

2. Open http://localhost:3000 on your browser
